import { Easing, type Storyboard, type StoryboardObject } from "./internalData";

/*
TODO: figure out data layout for internal representation.

TODO: don't forget z-indexing when making the objects, defined by the order
      declared in osb file, first = back, last = front.
*/

type FloatArrayConstructor = Float32ArrayConstructor;
type IntArrayConstructor = Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor | BigInt64ArrayConstructor | Uint8ArrayConstructor | Uint8ClampedArrayConstructor;
type TypedArrayConstructor = FloatArrayConstructor | IntArrayConstructor;

const handleOsbCommand = (lineVals: string[]) => {
    const command = lineVals[0].slice(1);
    const easing = parseInt(lineVals[1]) as Easing;
    const startTime = parseInt(lineVals[2]); // TODO: can time be a float?
    const endTime = parseInt(lineVals[3]);
    
};

const getVariables = (lines: string[]) => {};

export const osbToIr = async (filepath: string) => {
    const fileText = await (await fetch(filepath)).text();
    const fileLines = fileText.replaceAll("\r", "").split("\n");
    let sb: Storyboard = {
        objects: new Map(),
        timeline: []
    };
    for (let i = 0, len = fileLines.length; i < len; i++) {
        const line = fileLines[i];
        if (line.startsWith("//")
            || line.length == 0
            || line == "[Events]") continue;

        const lineVals = line.split(",");
        switch (lineVals[0]) {
            case "Sprite": { } break;
            case "Animation": { } break;
            case "Sample": { } break;
            default: {

            } break;
        }
    }
};