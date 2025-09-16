const FILE_METADATA_STORE = "fileMeta";
export interface FileMetadata {
    id: string;           // unique file identifier
    name: string;         // filename with extension
    path: string;         // full path (e.g., "/folder/subfolder/file.txt")
    size: number;         // in bytes
    type: string;         // MIME type
    created: number;      // timestamp
    modified: number;     // timestamp
}

const FILE_CONTENT_STORE = "fileContent";
interface FileContent {
    fileId: string;       // FileMetadata.id
    data: ArrayBuffer;    // file.arrayBuffer()
}

const DATABASE_NAME = "FileDirectory";
const DATABASE_VERSION = 1;

class FileSystemError extends Error {
    constructor(message: string, public cause?: unknown) {
        super(message);
        this.name = "FileSystemError";
    }
}

let dbInstance: IDBDatabase | null = null;
let isMetadataCacheLoaded = false;
let metadataCache: FileMetadata[] = [];
let cacheLoadPromise: Promise<void> | null = null;

export const getAllFileInfo = async (): Promise<FileMetadata[]> => {
    await populateLocalFileInfo();
    return [...metadataCache]; // Return copy to prevent external mutation
}

export const getFile = async (id: string): Promise<File> => {
    await populateLocalFileInfo();
    try {
        const db = await openDB();
        const tx = db.transaction(FILE_CONTENT_STORE, "readonly");
        const contentStore = tx.objectStore(FILE_CONTENT_STORE);
        const request = contentStore.get(id);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const result = request.result as FileContent;
                const metadata = metadataCache.find(v => v.id === result.fileId);
                if (result) {
                    resolve(new File([result.data],
                        metadata?.name ?? "",
                        { type: metadata?.type, lastModified: metadata?.modified }));
                } else {
                    reject(new FileSystemError(`File content not found for ID: ${id}`));
                }
            };
            request.onerror = () => reject(new FileSystemError("Failed to get file contents", request.error));
        });
    } catch (error) {
        throw new FileSystemError("Failed to access database", error);
    }
}

/**
 * @param file File to save
 * @param path Path to save file to within virtual FS
 * @param id Providing ID will overwrite existing file, otherwise create new file.
 * @returns Promise with resolve(fileID), reject(FileSystemError)
 */
export const saveFile = async (file: File, path: string, id?: string): Promise<string> => {
    await populateLocalFileInfo();

    const validatedPath = validatePath(path);
    const fileId = id ?? crypto.randomUUID();
    const currentTime = Date.now();

    const metadata: FileMetadata = {
        id: fileId,
        name: file.name,
        path: validatedPath,
        size: file.size,
        type: file.type,
        created: id ? (metadataCache.find(f => f.id === id)?.created ?? currentTime) : currentTime,
        modified: file.lastModified ?? currentTime
    };

    const content: FileContent = {
        fileId: fileId,
        data: await file.arrayBuffer()
    };

    try {
        const db = await openDB();
        const tx = db.transaction([FILE_METADATA_STORE, FILE_CONTENT_STORE], "readwrite");

        return new Promise<string>((resolve, reject) => {
            const metaStore = tx.objectStore(FILE_METADATA_STORE);
            const contentStore = tx.objectStore(FILE_CONTENT_STORE);

            metaStore.put(metadata);
            contentStore.put(content);

            tx.oncomplete = () => {
                const existingIndex = metadataCache.findIndex(f => f.id === metadata.id);
                if (existingIndex >= 0) {
                    metadataCache[existingIndex] = metadata;
                } else {
                    metadataCache.push(metadata);
                }
                resolve(fileId);
            };
            tx.onerror = () => reject(new FileSystemError("Transaction failed", tx.error));
        });
    } catch (error) {
        throw new FileSystemError("Failed to save file", error);
    }
}

export const deleteFile = async (id: string): Promise<void> => {
    await populateLocalFileInfo();

    try {
        const db = await openDB();
        const tx = db.transaction([FILE_METADATA_STORE, FILE_CONTENT_STORE], "readwrite");

        return new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => {
                const index = metadataCache.findIndex(f => f.id === id);
                if (index >= 0) {
                    metadataCache.splice(index, 1);
                }
                resolve();
            };
            tx.onerror = () => reject(new FileSystemError("Failed to delete file", tx.error));

            const metaStore = tx.objectStore(FILE_METADATA_STORE);
            const contentStore = tx.objectStore(FILE_CONTENT_STORE);

            metaStore.delete(id);
            contentStore.delete(id);
        });
    } catch (error) {
        throw new FileSystemError("Failed to delete file", error);
    }
}

export const getFilesByPath = async (path: string): Promise<FileMetadata[]> => {
    await populateLocalFileInfo();
    const normalizedPath = validatePath(path);
    return metadataCache.filter(file => file.path === normalizedPath);
}

export const getDirectoryContents = async (dirPath: string): Promise<FileMetadata[]> => {
    await populateLocalFileInfo();
    const validatedPath = validatePath(dirPath);
    const directoryPath = validatedPath.endsWith("/") ? validatedPath : validatedPath + "/";

    return metadataCache.filter(file =>
        file.path.startsWith(directoryPath) &&
        !file.path.substring(directoryPath.length).includes("/")
    );
}

const openDB = async (): Promise<IDBDatabase> => {
    if (dbInstance) return dbInstance;
    indexedDB.deleteDatabase(DATABASE_NAME); // TODO: VITAL, DELETE AFTER TESTING IS ALL GOOD.

    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    const createObjectStores = (ev: Event) => {
        const db = (ev.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(FILE_METADATA_STORE)) {
            const metadataStore = db.createObjectStore(FILE_METADATA_STORE, { keyPath: "id" });
            metadataStore.createIndex("path", "path", { unique: false });
            metadataStore.createIndex("name", "name", { unique: false });
        }

        if (!db.objectStoreNames.contains(FILE_CONTENT_STORE)) {
            db.createObjectStore(FILE_CONTENT_STORE, { keyPath: "fileId" });
        }
    };

    request.onupgradeneeded = createObjectStores;

    dbInstance = await new Promise<IDBDatabase>((resolve, reject) => {
        request.onsuccess = (ev) => {
            createObjectStores(ev);
            resolve(request.result);
        }
        request.onerror = () => reject(new FileSystemError("Failed to open database", request.error));
    });

    // Handle database connection close
    dbInstance.onclose = () => {
        dbInstance = null;
    };

    return dbInstance;
}

const populateLocalFileInfo = async (): Promise<void> => {
    if (isMetadataCacheLoaded || cacheLoadPromise) return;

    cacheLoadPromise = loadMetadataCache();
    await cacheLoadPromise;
    cacheLoadPromise = null;
}

const loadMetadataCache = async (): Promise<void> => {
    try {
        const db = await openDB();
        const tx = db.transaction(FILE_METADATA_STORE, "readonly");
        const store = tx.objectStore(FILE_METADATA_STORE);
        const request = store.getAll();

        metadataCache = await new Promise<FileMetadata[]>((resolve, reject) => {
            request.onsuccess = () => resolve(request.result as FileMetadata[]);
            request.onerror = () => reject(new FileSystemError("Failed to load file metadata", request.error));
        });

        isMetadataCacheLoaded = true;
    } catch (error) {
        throw new FileSystemError("Failed to populate file info", error);
    }
}

const validatePath = (path: string): string => {
    if (!path || typeof path !== "string") {
        throw new FileSystemError("Path must be a non-empty string");
    }

    // Normalize path
    let normalized = path.trim();
    if (!normalized.startsWith("/")) {
        normalized = "/" + normalized;
    }

    // Remove duplicate slashes and resolve relative paths
    normalized = normalized.replace(/\/+/g, "/");

    // Check for invalid path components
    if (normalized.includes("..") || normalized.includes("./")) {
        throw new FileSystemError("Invalid path: contains relative path components");
    }

    // Remove trailing slash except for root
    if (normalized.length > 1 && normalized.endsWith("/")) {
        normalized = normalized.slice(0, -1);
    }

    return normalized;
}

// Utility method to clear cache (useful for testing/development)
export const clearMetadataCache = (): void => {
    isMetadataCacheLoaded = false;
    metadataCache = [];
    cacheLoadPromise = null;
}

// Close database connection
export const closeDB = (): void => {
    if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
    }
}