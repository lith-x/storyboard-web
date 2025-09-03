type TabData = { id: string, label: string, icon: string }

export const topSidebarTabData: TabData[] = [
    { id: "%%home", label: "Home", icon: "🏠" },
    { id: "%%files", label: "Files", icon: "📔" }
];
export const defaultActiveTab = topSidebarTabData[0].id;

export const settingsTabData: TabData = {
    id: "%%settings", label: "Settings", icon: "⚙️"
};