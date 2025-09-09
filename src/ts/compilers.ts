import { Easing, type Storyboard, type StoryboardObject } from "./internalData";

/*
TODO: figure out data layout for internal representation.

TODO: don't forget z-indexing when making the objects, defined by the order
      declared in osb file, first = back, last = front.
*/
const getVariables = (filepath: string, lines: string[], varLineIdx: number) => {
    // TODO: are blank lines allowed in this section?
    // line: $variable=anystring
    const vMap = new Map<string, string>();
    let idx = varLineIdx;
    while (idx += 1) {
        const [varName, varVal] = lines[idx].split("=", 2);
        if (!varName.startsWith("$")) throw new Error(`${filepath}:${idx + 1}:1: variable name must start with $`);
        vMap.set(varName, varVal);
    }
    return vMap;
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
            
        }
    } while ((lineIdx += 1) < linesLen)
};