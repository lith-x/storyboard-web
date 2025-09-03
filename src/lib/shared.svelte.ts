// TODO: figure out better data placement/organization such that
//       potential future refactors would be easier, less bouncing
//       around between files to keep track of where all I use this.
//       maybe within Panel files, or centralize "Home" as a single

export const homeTabData = { id: "%%home", label: "Home", icon: "🏠" };
export const fileTabData = { id: "%%files", label: "Files", icon: "📔" };
export const settingsTabData = { id: "%%settings", label: "Settings", icon: "⚙️" };

export const topTabs = [homeTabData, fileTabData];
export const bottomTabs = [settingsTabData];

export const defaultActiveTab = homeTabData.id;