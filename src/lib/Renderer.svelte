<script lang="ts">
    import { Application } from "pixi.js";
    import { onDestroy, onMount } from "svelte";
    let elt!: HTMLDivElement;
    const setupApp = async () => {
        const app = new Application();
        await app.init({ resizeTo: elt, background: "#555" });
        elt.appendChild(app.canvas);
        const observer = new ResizeObserver(() => {
            const { clientWidth, clientHeight } = elt;
            app.renderer.resize(clientWidth, clientHeight);
        });
        observer.observe(elt);
        onDestroy(() => {
            observer.disconnect();
            app.destroy(true);
        });
    };

    onMount(setupApp);
</script>

<div bind:this={elt} class="bg-pink-900 w-full h-full"></div>
