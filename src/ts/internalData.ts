type Values<T> = T[keyof T];

// Enums

export const SbObjectType = {
    Sprite: 0,
    Animation: 1,
    Sample: 2
} as const;
export type SbObjectType = Values<typeof SbObjectType>;
export const SbObjectTypeMap: Record<string, SbObjectType> = {
    "Sprite": SbObjectType.Sprite,
    "Animation": SbObjectType.Animation,
    "Sample": SbObjectType.Sample
};

export const Origin = {
    TopLeft: 0,
    Centre: 1,
    CentreLeft: 2,
    TopRight: 3,
    BottomCentre: 4,
    TopCentre: 5,
    Custom: 6, // from documentation, same as TopLeft.
    CentreRight: 7,
    BottomLeft: 8,
    BottomRight: 9
} as const;
export type Origin = Values<typeof Origin>;
export const OriginMap: Record<string, Origin> = {
    "TopLeft": Origin.TopLeft,
    "Centre": Origin.Centre,
    "CentreLeft": Origin.CentreLeft,
    "TopRight": Origin.TopRight,
    "BottomCentre": Origin.BottomCentre,
    "TopCentre": Origin.TopCentre,
    "Custom": Origin.Custom,
    "CentreRight": Origin.CentreRight,
    "BottomLeft": Origin.BottomLeft,
    "BottomRight": Origin.BottomRight
};

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
export const EasingMap: Record<string, Easing> = {
    "Linear": Easing.Linear,
    "EasingOut": Easing.EasingOut,
    "EasingIn": Easing.EasingIn,
    "QuadIn": Easing.QuadIn,
    "QuadOut": Easing.QuadOut,
    "QuadInOut": Easing.QuadInOut,
    "CubicIn": Easing.CubicIn,
    "CubicOut": Easing.CubicOut,
    "CubicInOut": Easing.CubicInOut,
    "QuartIn": Easing.QuartIn,
    "QuartOut": Easing.QuartOut,
    "QuartInOut": Easing.QuartInOut,
    "QuintIn": Easing.QuintIn,
    "QuintOut": Easing.QuintOut,
    "QuintInOut": Easing.QuintInOut,
    "SineIn": Easing.SineIn,
    "SineOut": Easing.SineOut,
    "SineInOut": Easing.SineInOut,
    "ExpoIn": Easing.ExpoIn,
    "ExpoOut": Easing.ExpoOut,
    "ExpoInOut": Easing.ExpoInOut,
    "CircIn": Easing.CircIn,
    "CircOut": Easing.CircOut,
    "CircInOut": Easing.CircInOut,
    "ElasticIn": Easing.ElasticIn,
    "ElasticOut": Easing.ElasticOut,
    "ElasticHalfOut": Easing.ElasticHalfOut,
    "ElasticQuarterOut": Easing.ElasticQuarterOut,
    "ElasticInOut": Easing.ElasticInOut,
    "BackIn": Easing.BackIn,
    "BackOut": Easing.BackOut,
    "BackInOut": Easing.BackInOut,
    "BounceIn": Easing.BounceIn,
    "BounceOut": Easing.BounceOut,
    "BounceInOut": Easing.BounceInOut
};

export const Layer = {
    Background: 0,
    Fail: 1,
    Pass: 2,
    Foreground: 3
} as const;
export type Layer = Values<typeof Layer>;
export const LayerMap: Record<string, Layer> = {
    "Background": Layer.Background,
    "Fail": Layer.Fail,
    "Pass": Layer.Pass,
    "Foreground": Layer.Foreground
};

export const LoopType = {
    LoopOnce: 0,
    LoopForever: 1
} as const;
export type LoopType = Values<typeof LoopType>;
export const LoopTypeMap: Record<string, LoopType> = {
    "LoopOnce": LoopType.LoopOnce,
    "LoopForever": LoopType.LoopForever
};

export const TriggerType = {
    Passing: 0,
    Failing: 1,
    Hitsound: 2
} as const;
export type TriggerType = Values<typeof TriggerType>;
export const TriggerTypeMap: Record<string, TriggerType> = {
    "Passing": TriggerType.Passing,
    "Failing": TriggerType.Failing,
    // Hitsound will need regex to handle properly, not a string constant.
};

export const CommandType = {
    Fade: 0,
    Move: 1,
    MoveX: 2,
    MoveY: 3,
    Scale: 4,
    VectorScale: 5,
    Rotate: 6,
    Color: 7,
    Parameter: 8
} as const;
export type CommandType = Values<typeof CommandType>;
export const CommandTypeMap: Record<string, CommandType> = {
    "F": CommandType.Fade,
    "M": CommandType.Move,
    "MX": CommandType.MoveX,
    "MY": CommandType.MoveY,
    "S": CommandType.Scale,
    "V": CommandType.VectorScale,
    "R": CommandType.Rotate,
    "C": CommandType.Color,
    "P": CommandType.Parameter
};

export interface Vec2 {
    x: number;
    y: number;
}


class SimpleCommandArray {
    private data: ArrayBuffer;
    private types: Uint8Array;
    private easings: Uint8Array;
    private startTimes: Uint32Array;
    private endTimes: Uint32Array;
    private startOpacities: Float32Array;
    private endOpacities: Float32Array;
    private startXs: Int16Array;
    private startYs: Int16Array;
    private endXs: Int16Array;
    private endYs: Int16Array;
    private startScaleXs: Float32Array;
    private startScaleYs: Float32Array;
    private endScaleXs: Float32Array;
    private endScaleYs: Float32Array;
    private startRotations: Float32Array;
    private endRotations: Float32Array;
    private startRs: Uint8Array;
    private startGs: Uint8Array;
    private startBs: Uint8Array;
    private endRs: Uint8Array;
    private endGs: Uint8Array;
    private endBs: Uint8Array;
    private parameters: Uint8Array;
    // TODO/optimization: probably slower, but could help with memory footprint,
    //   gather all commands, then have a build(), or require the counts in the constructor,
    //   and only allocate needed memory, maintain indirection tables for each array
    constructor(count: number) {
        const fields8Bit = 9;
        const array8BitBytes = count * Int8Array.BYTES_PER_ELEMENT;
        const fields16Bit = 4;
        const array16BitBytes = count * Int16Array.BYTES_PER_ELEMENT;
        const fields32Bit = 10;
        const array32BitBytes = count * Int32Array.BYTES_PER_ELEMENT;
        this.data = new ArrayBuffer(
            fields8Bit * array8BitBytes +
            fields16Bit * array16BitBytes +
            fields32Bit * array32BitBytes
        );
        let offset = 0;
        // type: uint8 (enum, 8 vals)
        this.types = new Uint8Array(this.data, offset, count);
        offset += array8BitBytes;
        // easing: uint8 (enum, 35 vals)
        this.easings = new Uint8Array(this.data, offset, count);
        offset += array8BitBytes;
        // startTime: uint32
        this.startTimes = new Uint32Array(this.data, offset, count);
        offset += array32BitBytes;
        // endTime: uint32
        this.endTimes = new Uint32Array(this.data, offset, count);
        offset += array32BitBytes;
        
        // Fade:
        //   startOpacity: float32
        this.startOpacities = new Float32Array(this.data, offset, count);
        offset += array32BitBytes;
        //   endOpacity: float32
        this.endOpacities = new Float32Array(this.data, offset, count);
        offset += array32BitBytes;

        // Move/MoveX/MoveY:
        //   startX: int16(?)
        this.startXs = new Int16Array(this.data, offset, count);
        offset += array16BitBytes;
        //   startY: int16(?)
        this.startYs = new Int16Array(this.data, offset, count);
        offset += array16BitBytes;
        //   endX: int16(?)
        this.endXs = new Int16Array(this.data, offset, count);
        offset += array16BitBytes;
        //   endY: int16(?)
        this.endYs = new Int16Array(this.data, offset, count);
        offset += array16BitBytes;
        // Scale/VectorScale:
        //   startScale(X): float32
        this.startScaleXs = new Float32Array(this.data, offset, count);
        offset += array32BitBytes;
        //   startScaleY: float32
        this.startScaleYs = new Float32Array(this.data, offset, count);
        offset += array32BitBytes;
        //   endScale(X): float32
        this.endScaleXs = new Float32Array(this.data, offset, count);
        offset += array32BitBytes;
        //   endScaleY: float32
        this.endScaleYs = new Float32Array(this.data, offset, count);
        offset += array32BitBytes;
        // Rotate:
        //   startRotation: float32
        this.startRotations = new Float32Array(this.data, offset, count);
        offset += array32BitBytes;
        //   endRotation: float32
        this.endRotations = new Float32Array(this.data, offset, count);
        offset += array32BitBytes;
        // Color:
        //   startR: uint8
        this.startRs = new Uint8Array(this.data, offset, count);
        offset += array8BitBytes;
        //   startG: uint8
        this.startGs = new Uint8Array(this.data, offset, count);
        offset += array8BitBytes;
        //   startB: uint8
        this.startBs = new Uint8Array(this.data, offset, count);
        offset += array8BitBytes;
        //   endR: uint8
        this.endRs = new Uint8Array(this.data, offset, count);
        offset += array8BitBytes;
        //   endG: uint8
        this.endGs = new Uint8Array(this.data, offset, count);
        offset += array8BitBytes;
        //   endB: uint8
        this.endBs = new Uint8Array(this.data, offset, count);
        offset += array8BitBytes;
        // Parameter:
        //   params: uint8 (enum, 3 vals)
        this.parameters = new Uint8Array(this.data, offset, count);
        offset += array8BitBytes;
    }
}

export type Command = {
    type: CommandType;
    easing: Easing;
    startTime: number;
    endTime: number;
    // Fade
    startOpacity: number | undefined;
    endOpacity: number | undefined;
    // Move/MoveX/MoveY
    startX: number | undefined;
    startY: number | undefined;
    endX: number | undefined;
    endY: number | undefined;
    // Scale/VectorScale (scale in vector is scaleX)
    startScale: number | undefined;
    startScaleY: number | undefined;
    endScale: number | undefined;
    endScaleY: number | undefined;
    // Rotate
    startRotation: number | undefined;
    endRotation: number | undefined;
    // Color
    startR: number | undefined;
    startG: number | undefined;
    startB: number | undefined;
    endR: number | undefined;
    endG: number | undefined;
    endB: number | undefined;
    // Parameter
    parameter: "H" | "V" | "A" | undefined;
}

export interface StoryboardObject {
    id: string;
    type: SbObjectType;
    layer: Layer;
    origin: Origin;
    filepath: string;
    initialPosition: Vec2 | null;
    frameCount: number | null;
    frameDelay: number | null;
    loopType: LoopType | null;
    volume: number | null;
    playTime: number | null;
}

// used for optimization caching when the time comes
export interface ObjectState {
    position: Vec2;
    scale: Vec2;
    rotation: number;
    opacity: number;
    color: { r: number, g: number, b: number };
    flipHorizontal: boolean;
    flipVertical: boolean;
    additiveBlending: boolean;
    visible: boolean;
    zIndex: number;
}

export interface TimelineEntry {
    time: number;
    objectId: string;
    command: Command;
}

export interface Storyboard {
    objects: Map<string, StoryboardObject>;
    timeline: TimelineEntry[]; // NOTE: this needs to be kept sorted in order by ascending startTime val.

    // optimization ideas
    // frameCache: Map<number, Map<string, ObjectState>>; // time -> objId -> state
    // activePeriods: Map<string, Array<[number, number]>>; // use this to filter to only objects that are active
    //                                                      // between map.get(id)[0] and map.get(id)[1]
}