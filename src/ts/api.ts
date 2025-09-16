type Easing = string; // dummy type, fill in later.

// TODO: If (startVals, <undefined>, duration) is called on any command, throw an error
// that tells the user to get rid of the undefined, or use .at(duration).command(startVals)

// TODO: if 

const fadeImpl = (id: string, time: number, also: boolean, lastDuration: number): FadeCallback => {
    return (easing: Easing, startOpacity: number, endOpacity?: number, duration?: number) => {
        // cases 1=defined, 0=undefined
        // endOpacity 1, duration 1 (do nothing)
        // endOpacity 1, duration 0 (set duration to 0, done)
        // endOpacity 0, duration 1 (just throw an error "no value will be changed, use at() to skip time")
        // endOpacity 
        if (endOpacity === undefined) duration = 0;
        else if (duration === undefined) {
            duration = endOpacity;
            endOpacity = startOpacity;
        }
        return allFuncsObj(id, time, false, lastDuration);
    };
};

const moveImpl = (id: string, time: number, also: boolean, lastDuration: number): MoveCallback => {
    return (easing: Easing, startX: number, startY: number, endX?: number, endY?: number, duration: number = 0) => {
        // add move event
        return allFuncsObj(id, time, false, lastDuration);
    }
};
const moveXImpl = (id: string, time: number, also: boolean, lastDuration: number): MoveXCallback => {
    return (easing: Easing, startX: number, endX?: number, duration: number = 0) => {
        // add moveX event
        return allFuncsObj(id, time, false, lastDuration);
    }
};
const moveYImpl = (id: string, time: number, also: boolean, lastDuration: number): MoveYCallback => {
    return (easing: Easing, startY: number, endY?: number, duration: number = 0) => {
        // add moveX event
        return allFuncsObj(id, time, false, lastDuration);
    }
};
const scaleImpl = (id: string, time: number, also: boolean, lastDuration: number): ScaleCallback => {
    return (easing: Easing, startScale: number, endScale?: number, duration: number = 0) => {
        // add scale event
        return allFuncsObj(id, time, false, lastDuration);
    };
};
const vectorScaleImpl = (id: string, time: number, also: boolean, lastDuration: number): VectorScaleCallback => {
    return (easing: Easing, startScaleX: number, startScaleY: number, endScaleX?: number, endScaleY?: number, duration: number = 0) => {
        // add vectorScale event
        return allFuncsObj(id, time, false, lastDuration);
    };
}
const rotateImpl = (id: string, time: number, also: boolean, lastDuration: number): RotateCallback => {
    return (easing: Easing, startRotation: number, endRotation?: number, duration: number = 0) => {
        // add rotate event
        return allFuncsObj(id, time, false, lastDuration);
    };
};
const colorImpl = (id: string, time: number, also: boolean, lastDuration: number): ColorCallback => {
    return (easing: Easing, startR: number, startG: number, startB: number, endR?: number, endG?: number, endB?: number, duration: number = 0) => {
        // add color event
        return allFuncsObj(id, time, false, lastDuration);
    }
};
const paramImpl = (id: string, time: number, also: boolean, lastDuration: number): ParamCallback => {
    return (easing: Easing, param: Parameter, duration: number = 0) => {
        // add parameter event
        return allFuncsObj(id, time, false, lastDuration);
    }
};

const atImpl = (id: string, lastDuration: number) => {
    return (time: number) => {
        // change internal cursor
        return commandsObj(id, time, false, lastDuration);
    }
};

const alsoImpl = (id: string, time: number, lastDuration: number) => {
    return () => commandsObj(id, time, true, lastDuration);
};

const waitImpl = (id: string, lastDuration: number) => {
    return (duration: number) => {
        // change internal cursor and pass along
        return commandsObj(id, duration, false, lastDuration);
    }
}

type MoveCallback = {
    (easing: Easing, x: number, y: number): AllFunctionsChain;
    (easing: Easing, toX: number, toY: number, duration: number): AllFunctionsChain;
    (easing: Easing, startX: number, startY: number, endX: number, endY: number, duration: number): AllFunctionsChain;
}

type FadeCallback = {
    (easing: Easing, opacity: number): AllFunctionsChain;
    (easing: Easing, toOpacity: number, duration: number): AllFunctionsChain;
    (easing: Easing, startOpacity: number, endOpacity: number, duration: number): AllFunctionsChain;
}

type MoveXCallback = {
    (easing: Easing, x: number): AllFunctionsChain;
    (easing: Easing, toX: number, duration: number): AllFunctionsChain;
    (easing: Easing, startX: number, endX: number, duration: number): AllFunctionsChain;
}

type MoveYCallback = {
    (easing: Easing, y: number): AllFunctionsChain;
    (easing: Easing, toY: number, duration: number): AllFunctionsChain;
    (easing: Easing, startY: number, endY: number, duration: number): AllFunctionsChain;
}

type ScaleCallback = {
    (easing: Easing, scale: number): AllFunctionsChain;
    (easing: Easing, toScale: number, duration: number): AllFunctionsChain;
    (easing: Easing, startScale: number, endScale: number, duration: number): AllFunctionsChain;
}

type VectorScaleCallback = {
    (easing: Easing, xScale: number, yScale: number): AllFunctionsChain;
    (easing: Easing, toXScale: number, toYScale: number, duration: number): AllFunctionsChain;
    (easing: Easing, startXScale: number, startYScale: number, endXScale: number, endYScale: number, duration: number): AllFunctionsChain;
}

type RotateCallback = {
    (easing: Easing, rotation: number): AllFunctionsChain;
    (easing: Easing, toRotation: number, duration: number): AllFunctionsChain;
    (easing: Easing, startRotation: number, endRotation: number, duration: number): AllFunctionsChain;
}

type ColorCallback = {
    (easing: Easing, r: number, g: number, b: number): AllFunctionsChain;
    (easing: Easing, toR: number, toG: number, toB: number, duration: number): AllFunctionsChain;
    (easing: Easing, startR: number, startG: number, startB: number, endR: number, endG: number, endB: number, duration: number): AllFunctionsChain;
}

const Parameter = {
    Horizontal: "H",
    Vertical: "V",
    AlphaBlend: "A"
} as const;
type Parameter = typeof Parameter[keyof typeof Parameter];

type ParamCallback = {
    (easing: Easing, param: Parameter): AllFunctionsChain;
    (easing: Easing, toParam: Parameter, duration: number): AllFunctionsChain;
}

type AtCallback = (time: number) => CommandsChain;
type AlsoCallback = () => CommandsChain;
type WaitCallback = () => CommandsChain;

type AllFunctionsChain = CommandsChain & {
    at: AtCallback,
    also: AlsoCallback,
    wait: WaitCallback
}

type CommandsChain = {
    fade: FadeCallback,
    move: MoveCallback,
    moveX: MoveXCallback,
    moveY: MoveYCallback,
    scale: ScaleCallback,
    vectorScale: VectorScaleCallback,
    rotate: RotateCallback,
    color: ColorCallback,
    param: ParamCallback,
}

const commandsObj = (id: string, time: number, also: boolean, lastDuration: number) => {
    return {
        fade: fadeImpl(id, time, also, lastDuration),
        move: moveImpl(id, time, also, lastDuration),
        moveX: moveXImpl(id, time, also, lastDuration),
        moveY: moveYImpl(id, time, also, lastDuration),
        scale: scaleImpl(id, time, also, lastDuration),
        vectorScale: vectorScaleImpl(id, time, also, lastDuration),
        rotate: rotateImpl(id, time, also, lastDuration),
        color: colorImpl(id, time, also, lastDuration),
        param: paramImpl(id, time, also, lastDuration),
    }
}

const allFuncsObj = (id: string, time: number, also: boolean, lastDuration: number) => {
    return {
        at: atImpl(id, lastDuration),
        wait: waitImpl(id, lastDuration),
        also: alsoImpl(id, time, lastDuration),
        fade: fadeImpl(id, time, also, lastDuration),
        move: moveImpl(id, time, also, lastDuration),
        moveX: moveXImpl(id, time, also, lastDuration),
        moveY: moveYImpl(id, time, also, lastDuration),
        scale: scaleImpl(id, time, also, lastDuration),
        vectorScale: vectorScaleImpl(id, time, also, lastDuration),
        rotate: rotateImpl(id, time, also, lastDuration),
        color: colorImpl(id, time, also, lastDuration),
        param: paramImpl(id, time, also, lastDuration),
    } as AllFunctionsChain;
}

// this is a dummy interface to try to get what this may look like
// with actual code, everything under this is pretty much temporary,
// except the return value of "sprite" and the function chaining.
interface SpriteOpts {
    x: number, y: number
}
interface ObjData {
    contents: Blob,
    position: { x: number, y: number }
}
interface FileData { id: string, contents: Blob }

const objs = new Map<string, ObjData>();

const _getFile = (filepath: string) => {
    // dummy function
    return {
        id: crypto.randomUUID(),
        contents: new Blob([])
    } as FileData;
}


export const sprite = (filepath: string, opts?: SpriteOpts) => {
    // TODO: grab file from IndexedDB / cache
    const file = _getFile(filepath);
    objs.set(file.id, {
        // relevant file data, put here.
        contents: file.contents,
        position: { x: opts?.x ?? 0, y: opts?.y ?? 0 }
    });
    return {
        at: atImpl(file.id, 0)
    };
};

// Sample

// TODO: easings were tacked on at the end because i forgor about them,
//       I want there to be a way to have a linear-by-default easing value,
//       but the overloads would get incredibly jank. Try to figure this out.
const foo = sprite("sb/blob.png", { x: 0, y: 0 });
foo.at(0).fade("", 0.5) // time: 0, fade: 0.5, dur: 0
    .move("", 100, 100, 1000) // time: 0, pos: (0,0)->(100,100), dur: 1000
    .also().rotate("", 0, Math.PI, 500) // time: 0, rotate: 0->PI, dur: 500
    .move("", 150, 150, 300) // time: 1000 pos: (100,100)->(150,150), dur: 300
    .at(50).scale("", 1, 2) // time: 50, scale: 1->2, dur: 300