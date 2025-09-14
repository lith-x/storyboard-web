import { Application, Assets } from "pixi.js";

type StoryboardData = string;

class StoryboardRenderer {
    private static sbData: StoryboardData;
    private static time: number;
    private static pxapp: Application;
    private static resizer: ResizeObserver;

    public static setStoryboard(storyboard: StoryboardData) {
        this.sbData = storyboard;
    }

    public static seekTime(time: number) {
        this.time = time;
    }

    public static update() {
        this.pxapp.stage
    }


    public static init(elt: HTMLElement, storyboard: StoryboardData) {
        this.sbData = storyboard;
        this.pxapp = new Application();
        this.pxapp.init({ resizeTo: elt });

        elt.appendChild(this.pxapp.canvas);
        this.resizer = new ResizeObserver(() => {
            const { clientWidth, clientHeight } = elt;
            this.pxapp.renderer.resize(clientWidth, clientHeight);
        });
        this.resizer.observe(elt);
        this.seekTime(0);
    }

    public static destroy() {
        this.resizer.disconnect();
        this.pxapp.destroy(true);
    }
}