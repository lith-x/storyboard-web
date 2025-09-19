import { z, ZodIssueCode } from "zod";

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
const zEasing = z.enum(Easing);
type Easing = z.infer<typeof zEasing>;

const Parameter = {
    Horizontal: "H",
    Vertical: "V",
    AlphaBlend: "A"
} as const;
const zParameter = z.enum(Parameter);
type Parameter = z.infer<typeof zParameter>;

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
const zOrigin = z.enum(Origin);
type Origin = z.infer<typeof zOrigin>;

const Layer = {
    Background: "Background",
    Fail: "Fail",
    Pass: "Pass",
    Foreground: "Foreground"
} as const;
const zLayer = z.enum(Layer);
type Layer = z.infer<typeof zLayer>;

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
const zCmdType = z.enum(CmdType);
type CmdType = z.infer<typeof zCmdType>;

const zSpriteOpts = z.object({
    x: z.number().optional(),
    y: z.number().optional(),
    origin: zOrigin.optional(),
    layer: zLayer.optional()
});
type SpriteOpts = z.infer<typeof zSpriteOpts>;

const zObjState = z.object({
    posX: z.number(),
    posY: z.number(),
    scaleX: z.number(),
    scaleY: z.number(),
    opacity: z.number(),
    rotation: z.number(),
    colorR: z.number(),
    colorG: z.number(),
    colorB: z.number(),
    parameter: z.set(zParameter)
});
type ObjState = z.infer<typeof zObjState>;

const zObjEvent = z.object({
    type: zCmdType,
    easing: zEasing,
    startTime: z.number(),
    endTime: z.number(),
    params: z.union([z.array(z.number()), z.array(z.string())]),
    get subEvents() {
        return z.nullable(z.array(zObjEvent));
    }
});
type ObjEvent = z.infer<typeof zObjEvent>;

interface SpriteData {
    fileId: string,
    also: boolean,
    time: number,
    lastDuration: number,
    objState: ObjState,
    events: ObjEvent[]
}
const zSpriteData = z.object({
});

const throwCmdFormatError = (type: CmdType) => { throw new Error(`Parameters of command ${type} are not well-formatted.`); }

class CommandParameterFormatError extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "CommandParameterFormatError";
    }
}

interface AtOnlyMethods {
    at(time: number): SpriteCommands;
}

interface FlowControlMethods {
    also(): SpriteCommands;
    wait(duration: number): SpriteCommands;
}

interface BaseSprite {
    fade(toOpacity: number, duration?: number, easing?: Easing): SpriteAll;
    fade(range: [fromOpacity: number, toOpacity: number], duration?: number, easing?: Easing): SpriteAll;

    moveX(toX: number, duration?: number, easing?: Easing): SpriteAll;
    moveX(range: [fromX: number, toX: number], duration?: number, easing?: Easing): SpriteAll;

    moveY(toY: number, duration?: number, easing?: Easing): SpriteAll;
    moveY(range: [fromY: number, toY: number], duration?: number, easing?: Easing): SpriteAll;

    scale(toScale: number, duration?: number, easing?: Easing): SpriteAll;
    scale(range: [fromScale: number, toScale: number], duration?: number, easing?: Easing): SpriteAll;

    rotate(toRotation: number, duration?: number, easing?: Easing): SpriteAll;
    rotate(range: [startRotation: number, endRotation: number], duration?: number, easing?: Easing): SpriteAll;

    move(toX: number, toY: number, duration?: number, easing?: Easing): SpriteAll;
    move(fromVals: [fromX: number, fromY: number], toVals: [toX: number, toY: number], duration?: number, easing?: Easing): SpriteAll;

    vectorScale(toScaleX: number, toScaleY: number, duration?: number, easing?: Easing): SpriteAll;
    vectorScale(fromVals: [fromScaleX: number, fromScaleY: number], toVals: [toScaleX: number, toScaleY: number], duration?: number, easing?: Easing): SpriteAll;

    color(toR: number, toG: number, toB: number, duration?: number, easing?: Easing): SpriteAll;
    color(fromVals: [fromR: number, fromG: number, fromB: number], toVals: [toR: number, toG: number, toB: number], duration?: number, easing?: Easing): SpriteAll;

    param(params: Parameter | Parameter[], duration?: number, easing?: Easing): SpriteAll;
}

// Three-state conditional intersection
type SpriteType<State extends "initial" | "commands" | "all" | "complete"> =
    State extends "initial" ? AtOnlyMethods :
    State extends "commands" ? BaseSprite :
    State extends "all" ? AtOnlyMethods & FlowControlMethods & BaseSprite :
    never;

const zColorVal = z.int().min(0).max(255);
const zColorTuple = z.tuple([zColorVal, zColorVal, zColorVal]);

class SpriteImpl implements AtOnlyMethods, BaseSprite, FlowControlMethods {
    constructor(private data: SpriteData) { }

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

    private handleSimpleCommand = z.function({
        input: [
            zCmdType, zObjState.keyof().exclude(["parameter"]),
            z.union([z.number(), z.tuple([z.number(), z.number()])]),
            z.number().optional(),
            zEasing.optional()]
    }).implement((type, field, vals, duration, easing): SpriteImpl => {
        const realDuration = duration ?? this.data.lastDuration;
        const params: number[] = [];
        if (typeof vals == "number") {
            params.push(this.data.objState[field], vals);
            this.data.objState[field] = vals;
        } else if (vals instanceof Array && vals.length == 2) {
            params.push(...vals);
            this.data.objState[field] = vals[1];
        }
        return this.commandCommon(type, params, realDuration, easing);
    });

    fade(vals: number | [number, number], duration?: number, easing?: Easing): SpriteAll {
        return this.handleSimpleCommand(CmdType.Fade, "opacity", vals, duration, easing);
    }

    moveX(vals: number | [number, number], duration?: number, easing?: Easing): SpriteAll {
        return this.handleSimpleCommand(CmdType.MoveX, "posX", vals, duration, easing);
    }

    moveY(vals: number | [number, number], duration?: number, easing?: Easing): SpriteAll {
        return this.handleSimpleCommand(CmdType.MoveY, "posY", vals, duration, easing);
    }

    rotate(vals: number | [number, number], duration?: number, easing?: Easing): SpriteAll {
        return this.handleSimpleCommand(CmdType.Rotate, "rotation", vals, duration, easing);
    }

    param = z.function({
        input: [
            z.union([zParameter, z.array(zParameter)]),
            z.number().optional(),
            zEasing.optional()
        ]
    }).implement((params, duration, easing): SpriteAll => {
        if (!(params instanceof Array)) params = [params];
        const result: string[] = [];
        for (let i = 0; i < params.length; i++) {
            if (!result.includes(params[i]))
                result.push(params[i]);
        }
        return this.commandCommon(CmdType.Parameter, result, duration, easing);
    });

    scale(vals: number | [number, number], duration?: number, easing?: Easing): SpriteAll {
        if (typeof vals === "number") {
            return this.handleXYCommand(CmdType.Scale, ["scaleX", "scaleY"], [vals, vals], duration, easing);
        } else {
            return this.handleXYCommand(CmdType.Scale, ["scaleX", "scaleY"], [[vals[0], vals[0]], [vals[1], vals[1]]], duration, easing);
        }
    }

    move(fromValsOrToX: number | [number, number], toValsOrToY: number | [number, number], duration?: number, easing?: Easing): SpriteAll {
        // as: zod does run-time type validation in handleXYCommand
        return this.handleXYCommand(CmdType.Move, ["posX", "posY"], [fromValsOrToX as number, toValsOrToY as number], duration, easing);
    }

    vectorScale(fromValsOrToScaleX: number | [number, number], toValsOrToScaleY: number | [number, number], duration?: number, easing?: Easing): SpriteAll {
        // as: zod does run-time type validation in handleXYCommand
        return this.handleXYCommand(CmdType.VectorScale, ["scaleX", "scaleY"], [fromValsOrToScaleX as number, toValsOrToScaleY as number], duration, easing);
    }

    private handleXYCommand = z.function({
        input: [
            zCmdType,
            z.array(zObjState.keyof().exclude(["parameter"])).length(2),
            z.union([z.tuple([z.number(), z.number()]), z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])])]),
            z.number().optional(),
            zEasing.optional()]
    }).implement((type, fields, vals, duration, easing): SpriteImpl => {
        const params: number[] = [];
        if (typeof vals[0] == "number" && typeof vals[1] == "number") {
            params.push(this.data.objState[fields[0]], this.data.objState[fields[1]], vals[0], vals[1]);
        } else if (vals[0] instanceof Array && vals[1] instanceof Array){
            params.push(...vals[0], ...vals[1]);
        }
        return this.commandCommon(type, params, duration, easing);
    });

    color(fromValsOrToR: number | number[], toValsOrToG: number | number[], durationOrToB?: number, easingOrDuration?: number | Easing, easingMaybe?: Easing): SpriteAll {
        if (fromValsOrToR instanceof Array) {
            return this.colorImpl([fromValsOrToR as any, toValsOrToG as any], durationOrToB, easingOrDuration as Easing);
        }
        // color(toR: number, toG: number, toB: number, duration?: number, easing?: Easing): SpriteAll;
        // color(fromVals: [fromR: number, fromG: number, fromB: number], toVals: [toR: number, toG: number, toB: number], duration?: number, easing?: Easing): SpriteAll;

        return this;
    }

    private colorImpl = z.function({input: [
        z.union([z.tuple([zColorVal, zColorVal, zColorVal]), z.tuple([zColorTuple, zColorTuple])]),
        z.number().optional(),
        zEasing.optional()
    ]}).implement((vals, duration, easing): SpriteImpl => {
        return this;
    })

    private commandCommon(type: CmdType, params: number[] | string[], duration?: number, easing?: Easing) {
        const realDuration = duration ?? this.data.lastDuration;
        this.data.events.push({
            easing: easing ?? Easing.Linear,
            startTime: this.data.time,
            endTime: this.data.time + realDuration,
            type: type,
            params: params,
            subEvents: null
        });
        if (this.data.also) {
            this.data.also = false;
        } else {
            this.data.time += realDuration;
            this.data.lastDuration = realDuration;
        }
        return this;
    }
}

type SpriteInitial = SpriteType<"initial">;
type SpriteCommands = SpriteType<"commands">;
type SpriteAll = SpriteType<"all">;
type SpriteCompiled = SpriteType<"complete">;
type UserInputParam = Parameter | Parameter[] | number | number[];


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


/*
Breaking problem with the "use last value" approach.
 .at() completely breaks continuity.




*/