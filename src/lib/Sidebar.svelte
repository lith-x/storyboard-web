<!-- Sidebar.svelte -->
<script lang="ts">
  import { topSidebarTabData, settingsTabData } from "./shared.svelte";
  let { collapsed = $bindable() as boolean, active = $bindable() as string } =
    $props();

  let files: { id: string; name: string }[] = $state([
    { id: "file1", name: "main.ts" },
    { id: "file2", name: "App.svelte" },
  ]);

  // TODO: replace emojis with fontawesome glyphs
</script>

<div
  class="flex h-full flex-col bg-gray-900 text-gray-200 transition-all duration-300"
>
  <div class="flex items-center justify-between p-2">
    <span class="font-bold">{!collapsed ? "My App" : ""}</span>
    <button
      class="rounded-md p-1 hover:bg-gray-700"
      onclick={() => (collapsed = !collapsed)}
    >
      {collapsed ? "➡️" : "⬅️"}
    </button>
  </div>

  <div class="p-2">
    {#each topSidebarTabData as tab}
      <button
        class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-gray-700
          {active === tab.id ? 'bg-gray-700 font-semibold' : ''}"
        onclick={() => (active = tab.id)}
      >
        <span>{tab.icon}</span>
        {#if !collapsed}
          <span>{tab.label}</span>
        {/if}
      </button>
    {/each}
  </div>

  <div class="mx-2 my-2 border-t border-gray-700"></div>

  <div class="flex-1 overflow-y-auto p-2">
    {#each files as file}
      <div
        class="flex items-center justify-between rounded-md hover:bg-gray-700 {active ===
        file.id
          ? 'bg-gray-700 font-semibold'
          : ''}"
      >
        <button
          class="flex flex-1 items-center gap-2 px-3 py-2 text-left"
          onclick={() => (active = file.id)}
        >
          <span>📄</span>
          {#if !collapsed}
            <span class="truncate">{file.name}</span>
          {/if}
        </button>

        {#if !collapsed}
          <button
            class="px-2 text-gray-400 hover:text-red-400"
            aria-label="Close file"
            onclick={() => files.splice(files.indexOf(file), 1)}
          >
            ✕
          </button>
        {/if}
      </div>
    {/each}
  </div>

  <div class="p-2">
    <button
      class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-gray-700
          {active === settingsTabData.id ? 'bg-gray-700 font-semibold' : ''}"
      onclick={() => (active = settingsTabData.id)}
    >
      <span>{settingsTabData.icon}</span>
      {#if !collapsed}
        <span>{settingsTabData.label}</span>
      {/if}
    </button>
  </div>
</div>
