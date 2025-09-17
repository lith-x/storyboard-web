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
    Parameter: "P",
    Loop: "L",
    Trigger: "T"
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
    params: number[] | string[],
    subEvents: ObjEvent[] | null
}

interface SpriteData {
    fileId: string,
    also: boolean,
    time: number,
    lastDuration: number,
    objState: ObjState,
    events: ObjEvent[]
}

const throwCmdFormatError = (type: CmdType) => { throw new Error(`Parameters of command ${type} are not well-formatted.`); }

type OneParamCommandCallback = {
    (toValue: number, duration?: number, easing?: Easing): AllFunctionsChain;
    (range: [startValue: number, endValue: number], duration?: number, easing?: Easing): AllFunctionsChain;
}

type XYCallback = {
    (toX: number, toY: number, duration?: number, easing?: Easing): AllFunctionsChain;
    (rangeFrom: [fromX: number, fromY: number], rangeTo: [toX: number, toY: number], duration?: number, easing?: Easing): AllFunctionsChain;
}

const singleParamCommand = (data: SpriteData, type: CmdType, field: ObjNumParam): OneParamCommandCallback => {
    return (vals: number | number[], duration?: number, easing?: Easing) => {
        return handleCommand(data, type, [field], [vals], duration, easing);
    };
};

const xyParamCommand = (data: SpriteData, type: CmdType, fields: ObjNumParam[]): XYCallback => {
    return (fromValsOrToX: number | number[], toValsOrToY: number | number[], duration?: number, easing?: Easing) => {
        return handleCommand(data, type, fields, [fromValsOrToX, toValsOrToY], duration, easing);
    }
};


const scaleImpl = (data: SpriteData): OneParamCommandCallback => {
    return (vals: number | number[], duration?: number, easing?: Easing) => {
        if (typeof vals === "number") {
            return vectorScaleImpl(data)(vals, vals, duration, easing);
        } else {
            return vectorScaleImpl(data)([vals[0], vals[0]], [vals[1], vals[1]], duration, easing);
        }
    };
};

interface AtOnlyMethods {
    at(time: number): SpriteCommands;
}

interface FlowControlMethods {
    also(): SpriteCommands;
    wait(duration: number): SpriteCommands;
}

interface BaseSprite {
    fade(toValue: number, duration?: number, easing?: Easing): SpriteAll;
    fade(range: [startValue: number, endValue: number], duration?: number, easing?: Easing): SpriteAll;

    moveX(toX: number, duration?: number, easing?: Easing): SpriteAll;
    moveX(range: [fromX: number, toX: number], duration?: number, easing?: Easing): SpriteAll;

    moveY(toY: number, duration?: number, easing?: Easing): SpriteAll;
    moveY(range: [fromY: number, toY: number], duration?: number, easing?: Easing): SpriteAll;

    scale(toScale: number, duration?: number, easing?: Easing): SpriteAll;
    scale(range: [fromScale: number, toScale: number], duration?: number, easing?: Easing): SpriteAll;

    rotate(toRotation: number, duration?: number, easing?: Easing): SpriteAll;
    rotate(range: [startRotation: number, endRotation: number], duration?: number, easing?: Easing): SpriteAll;

    move(toX: number, toY: number, duration?: number, easing?: Easing): SpriteAll;
    move(rangeFrom: [fromX: number, fromY: number], rangeTo: [toX: number, toY: number], duration?: number, easing?: Easing): SpriteAll;

    vectorScale(toScaleX: number, toScaleY: number, duration?: number, easing?: Easing): SpriteAll;
    vectorScale(rangeFrom: [fromScaleX: number, fromScaleY: number], rangeTo: [toScaleX: number, toScaleY: number], duration?: number, easing?: Easing): SpriteAll;

    color(toR: number, toG: number, toB: number, duration?: number, easing?: Easing): SpriteAll;
    color(rangeFrom: [fromR: number, fromG: number, fromB: number], rangeTo: [toR: number, toG: number, toB: number], duration?: number, easing?: Easing): SpriteAll;

    param(params: Parameter | Parameter[], duration?: number, easing?: Easing): SpriteAll;
}

// Three-state conditional intersection
type SpriteType<State extends "initial" | "commands" | "all"> =
    State extends "initial" ? AtOnlyMethods :
    State extends "commands" ? BaseSprite :
    State extends "all" ? AtOnlyMethods & FlowControlMethods & BaseSprite :
    never;

class SpriteImpl implements AtOnlyMethods, BaseSprite, FlowControlMethods {
    constructor(private data: SpriteData) { }

    fade(range: number | number[], duration?: number, easing?: Easing): SpriteAll {
        return this.handleCommand(CmdType.Fade, ["opacity"], [range], duration, easing);
    }

    moveX(range: number | number[], duration?: number, easing?: Easing): SpriteAll {
        return this.handleCommand(CmdType.MoveX, ["posX"], [range], duration, easing);
    }

    moveY(range: number | number[], duration?: number, easing?: Easing): SpriteAll {
        return this;
    }

    scale(range: number | number[], duration?: number, easing?: Easing): SpriteAll {
        return this;
    }

    rotate(range: number | number[], duration?: number, easing?: Easing): SpriteAll {
        return this;
    }

    move(rangeFrom: number | number[], rangeTo: number | number[], duration?: number, easing?: Easing): SpriteAll {
        return this;
    }

    vectorScale(rangeFrom: number | number[], rangeTo: number | number[], duration?: number, easing?: Easing): SpriteAll {
        return this;
    }

    color(toROrRangeFrom: number | number[], toGOrRangeTo: number | number[], toBOrDuration?: number, durationOrEasing?: number | Easing, easingMaybe?: Easing): SpriteAll {
        if (toROrRangeFrom instanceof Array && toGOrRangeTo instanceof Array) {
            // TODO: the "as" here is doing a compile-time check, should be a runtime check as an additional check in "if"
            return this.handleCommand(CmdType.Color, ["colorR", "colorG", "colorB"], [toROrRangeFrom, toGOrRangeTo], toBOrDuration, durationOrEasing as Easing);
        } else if (typeof toBOrDuration === "number") {
            return this.handleCommand(CmdType.Color, ["colorR", "colorG", "colorB"], [toROrRangeFrom, toGOrRangeTo, toBOrDuration], durationOrEasing, easingMaybe);
        } else {
            return throwCmdFormatError(CmdType.Color);
        }
    }

    param(params: Parameter | Parameter[], duration?: number, easing?: Easing): SpriteAll {
        const realDuration = duration ?? this.data.lastDuration;
        const evt: ObjEvent = {
            easing: easing ?? Easing.Linear,
            startTime: this.data.time,
            endTime: this.data.time + realDuration,
            type: CmdType.Parameter,
            params: [],
            subEvents: null
        };
        for (const refParam of Object.values(Parameter)) {
            if (params.includes(refParam))
                (evt.params as string[]).push(refParam);
        }
        this.data.events.push(evt);
        if (this.data.also) {
            this.data.also = false;
        } else {
            this.data.time += realDuration;
            this.data.lastDuration = realDuration;
        }
        return this;
    }

    at(time: number): SpriteCommands {
        this.data.time = time;
        return this;
    }

    also(): SpriteCommands {
        this.data.also = true;
        return this;
    }

    wait(duration: number): SpriteCommands {
        this.data.time += duration;
        return this;
    }


    private singleParamCommand = (type: CmdType, field: ObjNumParam): OneParamCommandCallback => {
        return (vals: number | number[], duration?: number, easing?: Easing) => {
            return this.handleCommand(type, [field], [vals], duration, easing);
        };
    };

    private handleCommand(type: CmdType, stateSetFields: ObjNumParam[], params: (number | number[])[], duration?: number, easing?: Easing) {
        const realDuration = duration ?? this.data.lastDuration;
        const evt: ObjEvent = {
            easing: easing ?? Easing.Linear,
            startTime: this.data.time,
            endTime: this.data.time + realDuration,
            type: type,
            params: [],
            subEvents: null
        };
        if (params.every(v => typeof v === "number")) {
            if (params.length != stateSetFields.length)
                return throwCmdFormatError(type);
            for (let i = 0; i < stateSetFields.length; i++) {
                const field = stateSetFields[i];
                (evt.params as number[]).push(this.data.objState[field]);
                this.data.objState[field] = params[i];
            }
            (evt.params as number[]).push(...params);
        } else if (params.every(v => v instanceof Array)) {
            // FIXME: This completely butchers single parameter commands.
            if (params.length != 2 || params[0].length != params[1].length || params[0].length != stateSetFields.length)
                return throwCmdFormatError(type);
            (evt.params as number[]).push(...params[0], ...params[1]);
            for (let i = 0; i < params[1].length; i++) {
                this.data.objState[stateSetFields[i]] = params[1][i];
            }
        }
        this.data.events.push(evt);

        if (this.data.also) {
            this.data.also = false;
        } else {
            this.data.time += realDuration;
            this.data.lastDuration = realDuration;
        }
        return this;
    };
}

type SpriteInitial = SpriteType<"initial">;
type SpriteCommands = SpriteType<"commands">;
type SpriteAll = SpriteType<"all">;


const getDummyId = (_filepath: string) => {
    // dummy function
    return crypto.randomUUID();
}

const spriteDatas: SpriteData[] = [];

export const sprite = (filepath: string, opts?: SpriteOpts): SpriteInitial => {
    const fileId = getDummyId(filepath);
    const data: SpriteData = {
        time: 0,
        also: false,
        lastDuration: 0,
        fileId: fileId,
        events: [],
        // TODO: validate/cross-reference default state vals in osu client.
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
    spriteDatas.push(data);
    return new SpriteImpl(data);
};




// Sample

const foo = sprite("sb/blob.png", { x: 0, y: 0 });
foo.at(0).fade(0.5) // time: 0, fade: 0.5, dur: 0
    .move(100, 100, 1000, Easing.BackInOut) // time: 0, pos: (0,0)->(100,100), dur: 1000
    .also().rotate([0, Math.PI], 500) // time: 0, rotate: 0->PI, dur: 500
    .move(150, 150, 300) // time: 1000 pos: (100,100)->(150,150), dur: 300
    .at(50).scale([1, 2]) // time: 50, scale: 1->2, dur: 300


// Unimplemented / testing ground

let loopSprite: any;
loopSprite.at(0).loop(5, (sprite: any) => {
    sprite.move(100, 100, 30)
        .also().fade([0, 1], 50)
})

let triggerSprite: any;
triggerSprite.at(0).trigger("Passing", (sprite: any) => {
    sprite.move(100, 100, 30)
        .also().fade(0, 1, 50)
});


const loopImpl = (data: SpriteData) => {
    return (num: number, loopFn: (sprite: any) => any) => {

        // TODO: reminder that time in here is relative to the value of data.time when .loop() was called.
        // so .move(100, 200, 300) is startTime:0, endTime:300 (in real values, startTime:data.time, endTime:data.time+300)
    };
};

const triggerImpl = (data: SpriteData) => {
    return (obj: any) => {

    };
}
