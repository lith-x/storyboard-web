import { Application, Assets, RenderLayer, Sprite, Texture, type IRenderLayer } from "pixi.js";

type StoryboardData = {};

// TODO: implement sprite culling? (needs to be reflected in resulting OSB)

let sbData: StoryboardData | null;
let time = 0;
let pxapp: Application;
let resizer: ResizeObserver;
let initialized = false;
const layers: [IRenderLayer, IRenderLayer, IRenderLayer, IRenderLayer] = [
    new RenderLayer(),
    new RenderLayer(),
    new RenderLayer(),
    new RenderLayer()
];

export const setStoryboard = (storyboard: StoryboardData) => {
    sbData = storyboard;
}

export const AddSpriteStatus = {
    Success: 0,
    NotImage: 1,
    FormatNotSupported: 2
} as const;
export type AddSpriteStatus = typeof AddSpriteStatus[keyof typeof AddSpriteStatus];

export const Layer = {
    Background: 0,
    Fail: 1,
    Pass: 2,
    Foreground: 3
} as const;
export type Layer = typeof Layer[keyof typeof Layer];

/**
 * @param spriteFile Image file
 * @returns Enum value from AddSpriteStatus (0 on success) 
 */
export const addSprite = async (spriteFile: File, layer: Layer, zIndex?: number) => {
    if (!initialized) throw new Error("Called addSprite on uninitialized renderer.");
    const texture = Texture.from(await createImageBitmap(spriteFile));
    const sprite = new Sprite(texture);
    if (zIndex) sprite.zIndex = zIndex;
    layers[layer].attach(sprite);
}

export const seekTime = (time: number) => {
    time = time;
}

export const update = () => {
    if (!initialized) throw new Error("Called update on uninitialized renderer.");
    pxapp.ticker.update();
}

export const init = async (elt: HTMLElement, storyboard: StoryboardData) => {
    if (initialized) return;
    sbData = storyboard;
    pxapp = new Application();
    await pxapp.init({ resizeTo: elt, background: "#555" });
    initialized = true;

    elt.appendChild(pxapp.canvas);
    resizer = new ResizeObserver(() => {
        const { clientWidth, clientHeight } = elt;
        pxapp!.renderer.resize(clientWidth, clientHeight);
    });
    resizer.observe(elt);

    for (let i = 0; i < layers.length; i++)
        pxapp.stage.addChild(layers[i]);
}

export const destroy = () => {
    if (!initialized) return;
    resizer.disconnect();
    pxapp.destroy(true);
}