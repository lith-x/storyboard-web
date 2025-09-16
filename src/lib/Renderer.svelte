<script lang="ts">
    import { getAllFileInfo, getFile } from "../ts/dbHandler";
    import * as r from "../ts/render.svelte";
    import { onDestroy, onMount } from "svelte";
    let elt!: HTMLDivElement;
    const setupApp = async () => {
        await r.init(elt, {});
        // const fileInfo = await getAllFileInfo();
        const mychar = new File(
            [await (await fetch("char.png")).arrayBuffer()],
            "char.png",
            { type: "image/png" },
        );
        r.addSprite(mychar, r.Layer.Foreground);
        const bg = new File(
            [await (await fetch("bg1.jpg")).arrayBuffer()],
            "bg1.jpg",
            { type: "image/jpeg" },
        );
        r.addSprite(bg, r.Layer.Background);
        // for (const info of fileInfo) {
        //     if (info.type.startsWith("image/")) {
        //         r.addSprite(await getFile(info.id), r.Layer.Background);
        //         break;
        //     }
        // }
    };
    onMount(async () => {
        await setupApp();
    });
    onDestroy(r.destroy);
</script>

<div bind:this={elt} class="bg-pink-900 h-screen w-screen"></div>
