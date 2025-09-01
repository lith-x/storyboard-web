<script lang="ts">
  import { onMount } from "svelte";
  const sidebarWidth = 55;
  let panelWidth = $state(30);
  let timelineHeight = $state(25);
  let isDragging = $state(false);
  let gridColWidths = $derived(`${sidebarWidth}px ${panelWidth}% 1px 1fr`);
  let gridRowHeight = $derived(`${timelineHeight}% 1px 1fr`);

  let colDivider!: HTMLDivElement;
  let rowDivider!: HTMLDivElement;
  onMount(() => {
    const resizeWidthFn = (ev: MouseEvent) => {
      const newWidth = ((ev.clientX - sidebarWidth) / window.innerWidth) * 100;
      panelWidth = newWidth > 0 ? newWidth : 0;
    };
    const resizeHeightFn = (ev: MouseEvent) => {
      const newHeight = (ev.clientY / window.innerHeight) * 100;
      timelineHeight = newHeight > 0 ? newHeight : 0;
    };
    colDivider.addEventListener("mousedown", () => {
      document.body.style.cursor = "col-resize";
      document.addEventListener("mousemove", resizeWidthFn);
    });
    rowDivider.addEventListener("mousedown", () => {
      document.body.style.cursor = "row-resize";
      document.addEventListener("mousemove", resizeHeightFn);
    });
    document.addEventListener("mouseup", () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", resizeWidthFn);
      document.removeEventListener("mousemove", resizeHeightFn);
    });
  });
</script>

<main
  class="grid h-screen w-screen"
  style="grid-template-columns: {gridColWidths};"
>
  <div class="bg-amber-600"></div>
  <div class="bg-zinc-900"></div>
  <div bind:this={colDivider} class="cursor-col-resize"></div>
  <div
    class="grid grid-cols-subgrid"
    style="grid-template-rows: {gridRowHeight};"
  >
    <div class="bg-indigo-900"></div>
    <div bind:this={rowDivider} class="cursor-row-resize"></div>
    <div class="bg-pink-900"></div>
  </div>
</main>

<style lang="postcss">
  @reference "tailwindcss";
</style>
