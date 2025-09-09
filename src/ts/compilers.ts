import {
    CommandType, CommandTypeMap, Easing, EasingMap, Layer, LayerMap,
    Origin, OriginMap, SbObjectType, type Command, type Storyboard,
    type StoryboardObject, type TimelineEntry
} from "./internalData";

/*
TODO: don't forget z-indexing when making the objects, defined by the order
      declared in osb file, first = back, last = front.
*/

const lineToSprite = (line: string[]) => {
    // TODO: error checking
    const layer = LayerMap[line[1]] ? LayerMap[line[1]] : parseInt(line[1]) as Layer;
    const origin = OriginMap[line[2]] ? OriginMap[line[2]] : parseInt(line[2]) as Origin;
    return {
        id: crypto.randomUUID(),
        type: SbObjectType.Sprite,
        layer,
        origin,
        filepath: line[3],
        initialPosition: { x: parseInt(line[4]), y: parseInt(line[5]) },
        frameCount: null,
        frameDelay: null,
        loopType: null,
        volume: null,
        playTime: null
    } as StoryboardObject;
}

const lineToCommand = (line: string[], id: string) => {
    const cmdType = CommandTypeMap[line[0].substring(1)];
    // TODO: figure out what enums can be represented as strings, and
    //       which MUST be numeric. pretty sure easing MUST be numeric
    //       but not super sure, so leaving this in.
    const easing = EasingMap[line[1]] ? EasingMap[line[1]] : parseInt(line[1]) as Easing;
    const startTime = parseInt(line[2]);
    const endTime = parseInt(line[3]);
    const baseCommand = {
        type: cmdType,
        easing: EasingMap[line[1]] ? EasingMap[line[1]] : parseInt(line[1]) as Easing,
        startTime: parseInt(line[2]),
        endTime: parseInt(line[3]),
        startOpacity: undefined, endOpacity: undefined,
        startX: undefined, startY: undefined, endX: undefined, endY: undefined,

    } as Command;
    let cmdParams;
    switch (cmdType) {
        case CommandType.Fade: {
            cmdParams = {
                startOpacity: parseFloat(line[4]),
                endOpacity: parseFloat(line[5])
            } as Omit<FadeCommand, keyof BaseCommand>;
        } break;
        case CommandType.Move: {
            cmdParams = {
                startX: parseInt(line[4]),
                startY: parseInt(line[5]),
                endX: parseInt(line[6]),
                endY: parseInt(line[7])
            } as Omit<MoveCommand, keyof BaseCommand>;
        } break;
        case CommandType.MoveX: {
            cmdParams = {
                startX: parseInt(line[4]),
                endX: parseInt(line[5])
            } as Omit<MoveXCommand, keyof BaseCommand>;
        } break;
        case CommandType.MoveY: {
            cmdParams = {
                startY: parseInt(line[4]),
                endY: parseInt(line[5])
            } as Omit<MoveYCommand, keyof BaseCommand>;
        } break;
        case CommandType.Scale: {
            cmdParams = {
                startScale: parseInt(line[4]),
                endScale: parseInt(line[5])
            } as Omit<ScaleCommand, keyof BaseCommand>;
        } break;
        case CommandType.VectorScale: {
            cmdParams = {
                startScaleX: parseFloat(line[4]),
                startScaleY: parseFloat(line[5]),
                endScaleX: parseFloat(line[6]),
                endScaleY: parseFloat(line[7])
            } as Omit<VectorScaleCommand, keyof BaseCommand>;
        } break;
        case CommandType.Rotate: {
            cmdParams = {
                startRotation: parseFloat(line[4]),
                endRotation: parseFloat(line[5])
            } as Omit<RotateCommand, keyof BaseCommand>;
        } break;
        case CommandType.Color: {
            cmdParams = {
                startR: parseInt(line[4]),
                startG: parseInt(line[5]),
                startB: parseInt(line[6]),
                endR: parseInt(line[7]),
                endG: parseInt(line[8]),
                endB: parseInt(line[9])
            } as Omit<ColorCommand, keyof BaseCommand>;
        } break;
        case CommandType.Parameter: {
            cmdParams = {
                parameter: line[4]
            } as Omit<ParameterCommand, keyof BaseCommand>;
        } break;
        default: {
        } break;
    }
    return {
        command: Object.assign(baseCommand, cmdParams),
        objectId: id,
        time: startTime
    } as TimelineEntry;
};

/**
 * @returns Text of .osb with variable constants applied, and `[Variables]` section gone.
 */
const applyVariables = (fileText: string) => {
    const varsIdx = fileText.search(/^\[Variables\]$/m);
    if (varsIdx == -1) return fileText;
    const eventsIdx = fileText.search(/^\[Events\]$/m);
    if (eventsIdx == -1) return "";
    // NOTE: eventsIdx + 9 assumes \n line endings, if switched to \r\n, it will be off by 1.
    const [varsText, newFileText] = eventsIdx > varsIdx ?
        [fileText.substring(varsIdx, eventsIdx), fileText.substring(eventsIdx)] :
        [fileText.substring(varsIdx), fileText.substring(eventsIdx + 9, varsIdx)]
    let result = newFileText;
    for (const [, key, val] of varsText.matchAll(/^(\$.+)=(.+)$/gm)) {
        result = result.replaceAll(key, val);
    }
    return result;
    // TODO/optimization: compile all vars to a map, get a regex that rounds
    //                    up all the $vars, use map to replace in one pass
};

const osbToIr = async (filepath: string) => {
    const fileText = (await (await fetch(filepath)).text()).replaceAll("\r", "");
    const refinedFileText = applyVariables(fileText);
    let lineIdx = 0;
    const lines = refinedFileText.split("\n");
    const linesLen = lines.length;
    const sb: Storyboard = {
        objects: new Map(),
        timeline: []
    };

    do {
        const line = lines[lineIdx].split(",");
        if (line[0].startsWith("//"))
            continue;

        switch (line[0]) {
            case "Sprite": {
                const sprite = lineToSprite(line);
                sb.objects.set(sprite.id, sprite);
                while (true) {
                    const command = CommandTypeMap[]
                    sb.timeline.push({
                        command: 
                    })
                    lineIdx += 1;
                }
            } break;
            case "Animation": {

            } break;
            case "Sample": {

            } break;
        }
    } while ((lineIdx += 1) < linesLen)
};