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
type Origin = Values<typeof Origin>;

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
type Easing = Values<typeof Easing>;

export const Layer = {
    Background: 0,
    Fail: 1,
    Pass: 2,
    Foreground: 3
} as const;
type Layer = Values<typeof Layer>;

export const LoopType = {
    LoopOnce: 0, // "LoopOnce"
    LoopForever: 1 // "LoopForever"
} as const;
type LoopType = Values<typeof LoopType>;

type SpriteOpts = { x?: number, y?: number, layer?: Layer, origin?: Origin };

export const sprite = (
    filepath: string,
    opts?: SpriteOpts
) => { };

export const animation = (
    filepath: string,
    frameCount: number,
    frameDelay: number,
    loopType: LoopType,
    opts?: SpriteOpts
) => { };

export const sample = (
    filepath: string,
    time: number,
    layer: Layer,
    volume?: number
) => { }; // TODO: figure out good signature for this.