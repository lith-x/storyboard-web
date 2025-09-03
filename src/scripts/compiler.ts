

const osbToRenderObj = (osbSource: string) => {
    const lines = osbSource.split("\n");
    if (lines[0] != "[Events]") {
        return null;
    }
    const renderObj = {};
    lines.splice(0, 1);
    for (const line of lines) {
        if (line.startsWith("//")) continue;
        const lineParts = line.split(",");
        switch(lineParts[0]) {
            
        }
    }
};