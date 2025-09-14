<script lang="ts">
    import { Application, Sprite, Texture, TextureSource } from "pixi.js";
    import { onDestroy, onMount } from "svelte";
    let elt!: HTMLDivElement;
    let observer: ResizeObserver | undefined;
    let app: Application | undefined;
    const setupApp = async () => {
        app = new Application();
        await app.init({ resizeTo: elt, background: "#555" });
        elt.appendChild(app.canvas);
        const observer = new ResizeObserver(() => {
            const { clientWidth, clientHeight } = elt;
            app!.renderer.resize(clientWidth, clientHeight);
        });
        observer.observe(elt);
        const texture = new Texture({});
        const sprite = new Sprite({
            x: app.canvas.width / 2,
            y: app.canvas.height / 2,
            anchor: { x: 0.5, y: 0.5 },
        });
    };

    onMount(setupApp);

    onDestroy(() => {
        observer?.disconnect();
        app?.destroy(true);
    });
</script>

<div bind:this={elt} class="bg-pink-900 w-full h-full"></div>
