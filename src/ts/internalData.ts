type Values<T> = T[keyof T];

// Enums

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

export const Layer = {
    Background: 0,
    Fail: 1,
    Pass: 2,
    Foreground: 3
} as const;
export type Layer = Values<typeof Layer>;

export const LoopType = {
    LoopOnce: 0,
    LoopForever: 1
} as const;
export type LoopType = Values<typeof LoopType>;
export const LOOPTYPE_MAP: Record<string, LoopType> = {
    "LoopOnce": LoopType.LoopOnce,
    "LoopForever": LoopType.LoopForever
};

export const TriggerType = {
    Passing: 0,
    Failing: 1,
    Hitsound: 2
} as const;
export type TriggerType = Values<typeof TriggerType>;
export const TRIGGERTYPE_MAP: Record<string, TriggerType> = {
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
export const COMMANDTYPE_MAP: Record<string, CommandType> = {
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

export interface BaseCommand {
    type: string;
    easing: Easing;
    startTime: number;
    endTime: number;
}

export interface FadeCommand extends BaseCommand {
    type: "F";
    startOpacity: number;
    endOpacity: number;
}

export interface MoveCommand extends BaseCommand {
    type: "M";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export interface MoveXCommand extends BaseCommand {
    type: "MX";
    startX: number;
    endX: number;
}

export interface MoveYCommand extends BaseCommand {
    type: "MY";
    startY: number;
    endY: number;
}

export interface ScaleCommand extends BaseCommand {
    type: "S";
    startScale: number;
    endScale: number;
}

export interface VectorScaleCommand extends BaseCommand {
    type: "V";
    startScaleX: number;
    startScaleY: number;
    endScaleX: number;
    endScaleY: number;
}

export interface RotateCommand extends BaseCommand {
    type: "R";
    startRotation: number;
    endRotation: number;
}

export interface ColorCommand extends BaseCommand {
    type: "C";
    startR: number;
    startG: number;
    startB: number;
    endR: number;
    endG: number;
    endB: number;
}

export interface ParameterCommand extends BaseCommand {
    type: "P";
    parameter: "H" | "V" | "A";
}

type Command = FadeCommand | MoveCommand | MoveXCommand | MoveYCommand |
    ScaleCommand | VectorScaleCommand | RotateCommand | ColorCommand |
    ParameterCommand;

export interface StoryboardObject {
    id: string;
    type: "sprite" | "animation" | "audio";
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