import {
    CommandType, CommandTypeMap, Easing, EasingMap, Layer, LayerMap,
    Origin, OriginMap, SbObjectType, type Command, type CommandTypes, type StoryboardData, type StoryboardObject
} from "./internalData";

/*
TODO: don't forget z-indexing when making the objects, defined by the order
      declared in osb file, first = back, last = front.

official parser:
https://github.com/ppy/osu/blob/master/osu.Game/Beatmaps/Formats/LegacyStoryboardDecoder.cs
*/

const lineToSprite = (line: string[]) => {
    // TODO: error checking
    const layer = LayerMap[line[1]] ? LayerMap[line[1]] : parseInt(line[1]) as Layer;
    const origin = OriginMap[line[2]] ? OriginMap[line[2]] : parseInt(line[2]) as Origin;
    return {
        id: crypto.randomUUID(),
        type: "sprite",
        layer,
        origin,
        filepath: line[3],
        x: parseInt(line[4]),
        y: parseInt(line[5]),
        frameCount: null,
        frameDelay: null,
        loopType: null,
        volume: null,
        playTime: null
    } as StoryboardObject;
}
const pushCmd = (sb: StoryboardData, cmd: Command) => {
    if (!sb.commands.has(cmd.startTime)) {
        sb.commands.set(cmd.startTime, [cmd]);
    } else {
        sb.commands.get(cmd.startTime)!.push(cmd);
    }
};

const gatherCommands = (lines: string[], idx: number, sb: StoryboardData, objId: string) => {
    let currLine: string;
    const obj = sb.objects.get(objId);
    while ((currLine = lines[idx++]).startsWith(" ") || currLine.startsWith("_")) {
        const id = crypto.randomUUID(); // TODO: replace UUID's with plain ints incrementing
        const parts = currLine.split(",");
        const cmdType = parts[0].substring(1) as CommandTypes;
        const easing = EasingMap[parts[1]];
        const startTime = parseInt(parts[2]);
        const endTime = parseInt(parts[3]);
        switch (cmdType) {
            case "L": { } break;
            case "T": { } break;
            case "P": {
                pushCmd(sb, {
                    id: id,
                    objectId: objId,
                    type: cmdType,
                    easing: easing,
                    startTime: startTime,
                    endTime: endTime,
                    params: null,
                    hvaParam: parts[4] as "H" | "V" | "A",
                    trigger: null,
                    subCommands: null,
                });
            } break;
            default: {
                const params: number[] = [];
                for (let i = 4; i < parts.length; i++) {
                    params.push(parseFloat(parts[i])); // TODO: discriminate ints from floats here?
                }
                pushCmd(sb, {
                    id: id,
                    objectId: objId,
                    type: cmdType,
                    easing: easing,
                    startTime: startTime,
                    endTime: endTime,
                    params: params,
                    hvaParam: null,
                    trigger: null,
                    subCommands: null
                });
            }
        }
    }
    return idx;
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
    const sb: StoryboardData = {
        useSkinSprites: false,
        objects: new Map(),
        commands: new Map(),
    };

    do {
        const line = lines[lineIdx].split(",");
        if (line[0].startsWith("//"))
            continue;

        switch (line[0]) {
            case "Sprite": {
                const sprite = lineToSprite(line);
                sb.objects.set(sprite.id, sprite);
                lineIdx = gatherCommands(lines, lineIdx, sb, sprite.id);

            } break;
            case "Animation": {

            } break;
            case "Sample": {

            } break;
        }
    } while ((lineIdx += 1) < linesLen)
};