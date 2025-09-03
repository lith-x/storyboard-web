<script lang="ts">
  import Sidebar from "./lib/Sidebar.svelte";
  import Timeline from "./lib/Timeline.svelte";
  import Renderer from "./lib/Renderer.svelte";
  import ControlBar from "./lib/ControlBar.svelte";

  // TODO: have something more unique becaues possible name collisions
  const rowDividerId = "rowDivider";
  const colDividerId = "colDivider";

  const controlBarHeight = 55;

  let panelWidth = $state(30);
  let timelineHeight = $state(25);
  let sidebarCollapsed = $state(false);
  let sidebarWidth = $derived(sidebarCollapsed ? 55 : 224);

  let gridColWidths = $derived(`${sidebarWidth}px ${panelWidth}% 1px 1fr`);
  let gridRowHeights = $derived(
    `${timelineHeight}% 1px 1fr ${controlBarHeight}px`
  );

  const resizeWidthFn = (ev: MouseEvent) => {
    const newWidth = ((ev.clientX - sidebarWidth) / window.innerWidth) * 100;
    panelWidth = newWidth > 0 ? newWidth : 0;
  };

  const resizeHeightFn = (ev: MouseEvent) => {
    const newHeight = (ev.clientY / window.innerHeight) * 100;
    timelineHeight = newHeight > 0 ? newHeight : 0;
  };
  document.addEventListener("mousedown", (ev) => {
    switch ((ev.target as HTMLElement).id) {
      case rowDividerId:
        {
          document.body.style.cursor = "row-resize";
          document.addEventListener("mousemove", resizeHeightFn);
        }
        break;
      case colDividerId:
        {
          document.body.style.cursor = "col-resize";
          document.addEventListener("mousemove", resizeWidthFn);
        }
        break;
    }
  });
  document.addEventListener("mouseup", (ev) => {
    document.body.style.cursor = "";
    document.removeEventListener("mousemove", resizeWidthFn);
    document.removeEventListener("mousemove", resizeHeightFn);
  });
</script>

<main
  class="grid h-screen w-screen"
  style="grid-template-columns: {gridColWidths};"
>
  <div class="bg-amber-600">
    <Sidebar bind:collapsed={sidebarCollapsed} />
  </div>
  <div class="bg-zinc-900">
    <!-- Depending on what is selected on sidebar, could be one of any in /lib/panels/* -->
  </div>
  <div id={colDividerId} class="cursor-col-resize"></div>
  <div
    class="grid grid-cols-subgrid"
    style="grid-template-rows: {gridRowHeights};"
  >
    <Timeline />
    <div id={rowDividerId} class="cursor-row-resize"></div>
    <Renderer />
    <ControlBar />
  </div>
</main>

<style lang="postcss">
  @reference "tailwindcss";
</style>
