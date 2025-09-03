<script lang="ts">
  import { homeTabData, fileTabData, settingsTabData } from "./shared.svelte";
  import Home from "./panels/HomePanel.svelte";
  import Files from "./panels/FilePanel.svelte";
  import Settings from "./panels/SettingsPanel.svelte";

  const { activeTab = $bindable(homeTabData.id) } = $props();
  // TODO: this will basically be a switcher between everything in ./panels
</script>

<div class="bg-rose-300">
  {#if activeTab == homeTabData.id}
    <Home />
  {:else if activeTab == fileTabData.id}
    <Files />
  {:else if activeTab == settingsTabData.id}
    <Settings />
  {/if}
</div>
