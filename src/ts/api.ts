type Values<T> = T[keyof T];

export const Easing = {
    Linear: 0,
    EasingOut: 1,
    EasingIn: 2,
    QuadIn: 3,
    QuadOut: 4,
    QuadInOut: 5,
    CubicIn: 6,
    CubicOut: 7,
    CubicInOut: 8,
    QuartIn: 9,
    QuartOut: 10,
    QuartInOut: 11,
    QuintIn: 12,
    QuintOut: 13,
    QuintInOut: 14,
    SineIn: 15,
    SineOut: 16,
    SineInOut: 17,
    ExpoIn: 18,
    ExpoOut: 19,
    ExpoInOut: 20,
    CircIn: 21,
    CircOut: 22,
    CircInOut: 23,
    ElasticIn: 24,
    ElasticOut: 25,
    ElasticHalfOut: 26,
    ElasticQuarterOut: 27,
    ElasticInOut: 28,
    BackIn: 29,
    BackOut: 30,
    BackInOut: 31,
    BounceIn: 32,
    BounceOut: 33,
    BounceInOut: 34,
} as const;
export type Easing = Values<typeof Easing>;

const Parameter = {
    Horizontal: "H",
    Vertical: "V",
    AlphaBlend: "A"
} as const;
type Parameter = Values<typeof Parameter>;

const Origin = {
    TopLeft: "TopLeft",
    Centre: "Centre",
    CentreLeft: "CentreLeft",
    TopRight: "TopRight",
    BottomCentre: "BottomCentre",
    TopCentre: "TopCentre",
    Custom: "Custom",
    CentreRight: "CentreRight",
    BottomLeft: "BottomLeft",
    BottomRight: "BottomRight"
} as const;
type Origin = Values<typeof Origin>;

const Layer = {
    Background: "Background",
    Fail: "Fail",
    Pass: "Pass",
    Foreground: "Foreground"
} as const;
type Layer = Values<typeof Layer>;

const CmdType = {
    Fade: "F",
    Move: "M",
    MoveX: "MX",
    MoveY: "MY",
    Scale: "S",
    VectorScale: "V",
    Rotate: "R",
    Color: "C",
    Parameter: "P"
} as const;
type CmdType = Values<typeof CmdType>;

interface SpriteOpts {
    x?: number,
    y?: number,
    origin?: Origin,
    layer?: Layer
}

type ObjState = {
    posX: number,
    posY: number,
    scaleX: number,
    scaleY: number,
    opacity: number,
    rotation: number,
    colorR: number,
    colorG: number,
    colorB: number,
    parameter: Set<Parameter>
}
type ObjNumParam = keyof Omit<ObjState, "parameter">;

interface ObjEvent {
    type: CmdType,
    easing: Easing,
    startTime: number,
    endTime: number,
    params: number[]
}

interface ChainData {
    objId: string,
    also: boolean,
    time: number,
    lastDuration: number,
    objState: ObjState,
    events: ObjEvent[]
}


type OneParamCommandCallback = {
    (toValue: number, duration?: number, easing?: Easing): AllFunctionsChain;
    (range: [startValue: number, endValue: number], duration?: number, easing?: Easing): AllFunctionsChain;
}

const singleParamCommand = (data: ChainData, type: CmdType, field: ObjNumParam): OneParamCommandCallback => {
    return (vals: number | number[], duration?: number, easing?: Easing) => {
        const realDuration = duration ?? 0;
        const evt: ObjEvent = {
            easing: easing ?? Easing.Linear,
            startTime: data.time,
            endTime: data.time + realDuration,
            type: type,
            params: []
        };
        if (typeof vals === "number") {
            evt.params.push(data.objState[field]);
            evt.params.push(vals);
            data.objState[field] = vals;
        } else {
            evt.params.push(vals[0]);
            evt.params.push(vals[1]);
            data.objState[field] = vals[1];
        }
        data.events.push(evt);

        if (data.also) {
            data.also = false;
        } else {
            data.time += realDuration;
        }
        return allFuncsObj(data);
    };
};


const fadeImpl = (data: ChainData) => singleParamCommand(data, CmdType.Fade, "opacity");
const moveXImpl = (data: ChainData) => singleParamCommand(data, CmdType.MoveX, "posX");
const moveYImpl = (data: ChainData) => singleParamCommand(data, CmdType.MoveY, "posY");
const rotateImpl = (data: ChainData) => singleParamCommand(data, CmdType.Rotate, "rotation");


type XYCallback = {
    (toX: number, toY: number, duration?: number, easing?: Easing): AllFunctionsChain;
    (startX: number, startY: number, endX: number, endY: number, duration?: number, easing?: Easing): AllFunctionsChain;
}

const moveImpl = (data: ChainData): XYCallback => {
    return (startOrToX: number, startOrToY: number, endXOrDuration?: number, endYMaybe?: number, durationMaybe?: number, easing?: Easing) => {
        // add move event
        return allFuncsObj(data);
    }
};

const vectorScaleImpl = (data: ChainData): XYCallback => {
    return (startOrToScaleX: number, startOrToScaleY: number, endScaleXOrDuration?: number, endScaleYMaybe?: number, durationMaybe?: number, easing?: Easing) => {
        // add vectorScale event
        return allFuncsObj(data);
    };
}

const scaleImpl = (data: ChainData): OneParamCommandCallback => {
    return (vals: number | number[], duration?: number, easing?: Easing) => {
        if (typeof vals === "number") {
            return vectorScaleImpl(data)(vals, vals, duration, easing);
        } else {
            return vectorScaleImpl(data)(vals[0], vals[0], vals[1], vals[1], duration, easing);
        }
    };
};


type ColorCallback = {
    (toR: number, toG: number, toB: number, duration?: number, easing?: Easing): AllFunctionsChain;
    (startR: number, startG: number, startB: number, endR: number, endG: number, endB: number, duration: number, easing?: Easing): AllFunctionsChain;
}

const colorImpl = (data: ChainData): ColorCallback => {
    return (startR: number, startG: number, startB: number, endR?: number, endG?: number, endB?: number, duration?: number, easing?: Easing) => {
        // add color event
        return allFuncsObj(data);
    }
};

type ParamCallback = {
    (param: Parameter, easing?: Easing): AllFunctionsChain;
    (toParam: Parameter, duration: number, easing?: Easing): AllFunctionsChain;
}

const paramImpl = (data: ChainData): ParamCallback => {
    return (param: Parameter, duration?: number, easing?: Easing) => {
        // add parameter event
        return allFuncsObj(data);
    }
};


type AtCallback = (time: number) => CommandsChain;

const atImpl = (data: ChainData) => {
    return (time: number) => {
        data.time = time;
        return commandsObj(data);
    }
};


type AlsoCallback = () => CommandsChain;

const alsoImpl = (data: ChainData) => {
    return () => {
        data.also = true;
        commandsObj(data);
    }
};


type WaitCallback = (time: number) => CommandsChain;

const waitImpl = (data: ChainData) => {
    return (duration: number) => {
        data.time += duration;
        return commandsObj(data);
    }
}

type CommandsChain = {
    fade: OneParamCommandCallback,
    moveX: OneParamCommandCallback,
    moveY: OneParamCommandCallback,
    scale: OneParamCommandCallback,
    rotate: OneParamCommandCallback,
    move: XYCallback,
    vectorScale: XYCallback,
    color: ColorCallback,
    param: ParamCallback,
}

type AllFunctionsChain = CommandsChain & {
    at: AtCallback,
    also: AlsoCallback,
    wait: WaitCallback
}

const commandsObj = (data: ChainData) => {
    return {
        fade: fadeImpl(data),
        move: moveImpl(data),
        moveX: moveXImpl(data),
        moveY: moveYImpl(data),
        scale: scaleImpl(data),
        vectorScale: vectorScaleImpl(data),
        rotate: rotateImpl(data),
        color: colorImpl(data),
        param: paramImpl(data),
    }
}

const allFuncsObj = (data: ChainData) => {
    return {
        at: atImpl(data),
        wait: waitImpl(data),
        also: alsoImpl(data),
        fade: fadeImpl(data),
        move: moveImpl(data),
        moveX: moveXImpl(data),
        moveY: moveYImpl(data),
        scale: scaleImpl(data),
        vectorScale: vectorScaleImpl(data),
        rotate: rotateImpl(data),
        color: colorImpl(data),
        param: paramImpl(data),
    } as AllFunctionsChain;
}



interface FileData { id: string, contents: Blob }

const _getFile = (filepath: string) => {
    // dummy function
    return {
        id: crypto.randomUUID(),
        contents: new Blob([])
    } as FileData;
}

const objs: ChainData[] = [];

export const sprite = (filepath: string, opts?: SpriteOpts) => {
    // TODO: grab file from IndexedDB / cache
    const file = _getFile(filepath);
    const data: ChainData = {
        time: 0,
        also: false,
        lastDuration: 0,
        objId: file.id,
        events: [],
        objState: {
            posX: opts?.x ?? 0,
            posY: opts?.y ?? 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            rotation: 0,
            colorR: 255,
            colorG: 255,
            colorB: 255,
            parameter: new Set(),
        }
    };
    objs.push(data);
    return {
        at: atImpl(data)
    };
};

// Sample

const foo = sprite("sb/blob.png", { x: 0, y: 0 });
foo.at(0).fade(0.5) // time: 0, fade: 0.5, dur: 0
    .move(100, 100, 1000, Easing.BackInOut) // time: 0, pos: (0,0)->(100,100), dur: 1000
    .also().rotate([0, Math.PI], 500) // time: 0, rotate: 0->PI, dur: 500
    .move(150, 150, 300) // time: 1000 pos: (100,100)->(150,150), dur: 300
    .at(50).scale([1, 2]) // time: 50, scale: 1->2, dur: 300