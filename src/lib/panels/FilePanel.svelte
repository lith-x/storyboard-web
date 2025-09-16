<script lang="ts">
    import { getAllFileInfo, getFile, saveFile } from "../../ts/dbHandler";

    interface FilePanelInfo {
        id: string;
        name: string;
        size: number;
        type: string;
        previewUrl: string | null;
    }

    let panelFiles = $state<FilePanelInfo[]>([]);

    async function handleFileChange(e: Event) {
        const files = (e.target as HTMLInputElement).files;
        if (!files) return;
        for (const file of files) saveFile(file, "/"); // TODO: + button that brings a pop-up that allows you to choose directory.
        const fileInfoPromises = (await getAllFileInfo()).map(async (v) => {
            const result = {
                id: v.id,
                name: v.name,
                size: v.size,
                type: v.type,
                previewUrl: null,
            } as FilePanelInfo;
            if (v.type.startsWith("image/"))
                result.previewUrl = URL.createObjectURL(await getFile(v.id));
            return result;
        });
        panelFiles = await Promise.all(fileInfoPromises);
    }
</script>

<div class="p-4">
    <!-- TODO: top right instead of top left of the pane -->
    <label
        for="file-upload"
        class="cursor-pointer px-4 py-2 bg-sky-600 text-white rounded shadow hover:bg-sky-700"
    >
        +
    </label>
    <input
        id="file-upload"
        type="file"
        class="hidden"
        multiple
        onchange={handleFileChange}
    />

    <!-- File list -->
    <ul class="mt-4 space-y-2">
        {#each panelFiles as f}
            <li class="p-2 bg-gray-100 shadow text-sm">
                <div class="font-semibold">{f.name}</div>
                <div class="text-gray-600 text-xs">
                    {f.size} • {f.type}
                </div>
                {#if f.type.startsWith("image/")}
                    <img
                        src={f.previewUrl}
                        alt={f.name}
                        class="mt-2 max-h-40"
                    />
                {/if}
            </li>
        {/each}
    </ul>
</div>
