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

// Data

type CommandID = string;
type ObjectID = string;
type Timestamp = number;

export interface StoryboardData {
    useSkinSprites: boolean;
    objects: Map<ObjectID, StoryboardObject>;
    commands: Map<Timestamp, Command[]>;
}


export interface StoryboardObject {
    id: ObjectID;
    type: "sprite" | "animation" | "audio";
    layer: number;
    origin: number;
    filepath: string;
    x: number;
    y: number;
    // Animation-specific
    frameCount: number | null;
    frameDelay: Timestamp | null;
    loopType: "LoopOnce" | "LoopForever" | null;
    // Audio sample-specific
    volume: number | null;
    playTime: Timestamp | null;
    // Commands affecting this object
    commandIds: Set<CommandID>;
}

export interface Command {
    id: CommandID;
    objectId: ObjectID;
    type: "F" | "M" | "MX" | "MY" | "S" | "V" | "R" | "C" | "P" | "L" | "T";
    easing: number;
    startTime: Timestamp;
    endTime: Timestamp;
    params: number[];
    subCommands: Command[] | null;
    // sourceLocation: { line: number; column: number; file: string } | null;
}

export interface TimelineBuckets {
    bucketSizeMs: number; // time interval in ms
    buckets: Map<number, CommandBucket>;
}

export interface CommandBucket {
    startTime: Timestamp;
    endTime: Timestamp;
    commands: CommandID[];
    activeObjects: Set<ObjectID>; // objects where state has been computed
}

export interface ObjectState {
    objectId: ObjectID;
    time: Timestamp;
    opacity: number;
    position: { x: number; y: number };
    scale: { x: number; y: number };
    rotation: number;
    color: { r: number; g: number; b: number };
    parameters: Set<"H" | "V" | "A">;
}

/*

Storyboard
- Objects
  - CommandId[]
- Commands
  - ObjectId

ObjectStore
CommandStore
*/