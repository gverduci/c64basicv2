// Control codes from Vice project (petcat.c)
// https://sourceforge.net/p/vice-emu/code/HEAD/tree/trunk/vice/src/tools/petcat/petcat.c#l669

import { SpecialCharacter } from "./SpecialCharacter";
import * as fs from 'fs';
//
const ctrlCharSet1 = [
    /* 0x00 - 0x1f (petcat) */
    [
        "", "CTRL-A", "CTRL-B", "stop", "CTRL-D", "wht", "CTRL-F", "CTRL-G",
        "dish", "ensh", "\n", "CTRL-K", "CTRL-L", "\n", "swlc", "CTRL-O",
        "CTRL-P", "down", "rvon", "home", "del", "CTRL-U", "CTRL-V", "CTRL-W",
        "CTRL-X", "CTRL-Y", "CTRL-Z", "esc", "red", "rght", "grn", "blu"
    ],
    /* 0x00 - 0x1f (FIXME: MikroBITTI) */
    [
        "", "", "", "", "", "WHT", "", "",
        "up/lo lock on", "up/lo lock off", "", "", "", "return", "lower case", "",
        "", "DOWN", "RVS ON", "HOME", "delete", "", "", "",
        "", "", "", "esc", "RED", "RIGHT", "GRN", "BLU"
    ],
    /* 0x00 - 0x1f */
    [
        "", "", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "",
        "", "", "REVERSE ON", "", "", "", "", "",
        "", "", "", "", "", "", "", ""
    ],
    /* 0x00 - 0x1f (tok64) */
    [
        "", "", "", "", "", "white", "", "",
        "", "", "", "", "", "", "", "",
        "", "down", "reverse on", "home", "", "", "", "",
        "", "", "", "", "red", "right", "green", "blue"
    ],
    /* 0x00 - 0x1f (64er/checksummer v3) */
    [
        "", "", "", "", "", "WHITE", "", "",
        "", "", "", "", "", "RETURN", "", "",
        "", "DOWN", "RVSON", "HOME", "DEL", "", "", "",
        "", "", "", "", "RED", "RIGHT", "GREEN", "BLUE"
    ]
];

const ctrlCharSet2 = [
    /* 0x80 - 0x9f (petcat) */
    [
        "", "orng", "", "", "", "f1", "f3", "f5",
        "f7", "f2", "f4", "f6", "f8", "sret", "swuc", "",
        "blk", "up", "rvof", "clr", "inst", "brn", "lred", "gry1",
        "gry2", "lgrn", "lblu", "gry3", "pur", "left", "yel", "cyn"
    ],
    /* 0x80 - 0x9f (FIXME: MikroBITTI) */
    [
        "", "orange", "", "", "", "F1", "F3", "F5",
        "F7", "F2", "F4", "F6", "F8", "shift return", "upper case", "",
        "BLK", "UP", "RVS OFF", "CLR", "insert", "BROWN", "LT.RED", "GREY1",
        "GREY2", "lt green", "LT.BLUE", "GREY3", "PUR", "LEFT", "YEL", "cyn"
    ],
    /* 0x80 - 0x9f (tok64) */
    [
        "", "orange", "", "", "", "f1", "f3", "r5",
        "f7", "f2", "f4", "f6", "f8", "", "", "",
        "black", "up", "reverse off", "clear", "", "brown", "pink", "dark gray",
        "gray", "light green", "light blue", "light gray", "purple", "left", "yellow", "cyan",
    ],
    /* 0x80 - 0x9f (64er/Checksummer v3) */
    [
        "", "ORANGE", "", "", "", "F1", "F3", "F5",
        "F7", "F2", "F4", "F6", "F8", "", "", "",
        "BLACK", "UP", "RVSOFF", "CLR", "INST", "BROWN", "LIG.RED", "GREY 1",
        "GREY 2", "LIG.GREEN", "LIG.BLUE", "GREY 3", "PURPLE", "LEFT", "YELLOW", "CYAN",
    ],
    /* 0x80 - 0x9f (Computers Creating Arcade Games On The Commodore 64 - book) */
    [
        "", "[<1>]", "", "", "", "", "", "",
        "", "", "", "", "", "", "", "",
        "", "", "", "", "", "[<2>]", "[<3>]", "[<4>]",
        "[<5>]", "[<6>]", "[<7>]", "[<8>]", "", "", "", "",
    ]
];

/* https://www.c64-wiki.com/wiki/control_character */
const ctrlCharSetDescription: { [key: string]: string } = {
    "c5": "Changes the text color to white.",
    "c8": "Disables changing the character set using the SHIFT + Commodore key combination.",
    "c9": "Enables changing the character set using the SHIFT + Commodore key combination.",
    "c13": "Carriage return; next character will go in the first column of the following text line. As opposed to traditional ASCII-based system, no LINE FEED character needs to be sent in conjunction with this Carriage return character in the PETSCII system.",
    "c14": "Select the lowercase/uppercase character set.",
    "c17": "Cursor down: Next character will be printed in subsequent column one text line further down the screen.",
    "c18": "Reverse on: Selects reverse video text.",
    "c19": "Home: Next character will be printed in the upper left-hand corner of the screen.",
    "c20": "Delete, or \"backspace\"; erases the previous character and moves the cursor one character position to the left.",
    "c28": "Changes the text color to red.",
    "c29": "Advances the cursor one character position without printing anything.",
    "c30": "Changes the text color to green.",
    "c31": "Changes the text color to blue.",
    "c129": "Changes the text color to orange.",
    "c141": "Same action as Carriage return (13/$0D).",
    "c142": "Select the uppercase/semigraphics character set.",
    "c144": "Changes the text color to black.",
    "c145": "Cursor up: Next character will be printed in subsequent column one text line further up the screen.",
    "c146": "Reverse off: De-selects reverse video text.",
    "c147": "Clears screen of any text, and causes the next character to be printed at the upper left-hand corner of the text screen.",
    "c148": "Insert: Makes room for extra characters at the current cursor position, by \"pushing\" existing characters at that position further to the right.",
    "c149": "Changes the text color to brown.",
    "c150": "Changes the text color to light red.",
    "c151": "Changes the text color to dark grey.",
    "c152": "Changes the text color to medium grey.",
    "c153": "Changes the text color to light green.",
    "c154": "Changes the text color to light blue.",
    "c155": "Changes the text color to light grey.",
    "c156": "Changes the text color to purple.",
    "c157": "Moves the cursor one character position backwards, without printing or deleting anything.",
    "c158": "Changes the text color to yellow.",
    "c159": "Changes the text color to cyan."
};

function crushControlCharsInternal(lineText: string, ctrlCharSet1Delta: number, ctrlCharSet2Delta: number): string {
    const containsCommand = lineText.indexOf('{') > -1;
    if (containsCommand) {
        const groups: string[] = [];
        // const regExp = /\{(\w+|-|\s|\d+|\/|\.)*\}/gi;
        const regExp = /\{(.+?)\}+/gi;
        let match = regExp.exec(lineText);
        let crushed = lineText;
        while (match !== null) {
            if (match.index === regExp.lastIndex) {
                regExp.lastIndex++;
            }

            match.forEach(m => {
                groups.push(m);
            });
            match = regExp.exec(crushed);
        }

        // groups contains: ["{CLR}", "CLR", "{WHT}", "WHT", ...]
        //                      ^       ^
        //                      |       |
        //              to replace     to search in ctrlCharSet1/ctrlCharSet2
        for (let i = 0; i < groups.length; i += 2) {
            let finded = false;
            for (let j = 0; j < ctrlCharSet1.length; j++) {
                const c1 = ctrlCharSet1[j];
                const idx = c1.findIndex(element => {
                    return element.toLowerCase() === groups[i + 1].toLowerCase();
                });
                if (idx > -1) {
                    crushed = crushed.replace(groups[i], String.fromCharCode(idx + ctrlCharSet1Delta));
                    finded = true;
                    break;
                }
            }
            if (!finded) {
                for (let k = 0; k < ctrlCharSet2.length; k++) {
                    const c2 = ctrlCharSet2[k];
                    const idx = c2.findIndex(element => {
                        return element.toLowerCase() === groups[i + 1].toLowerCase();
                    });
                    if (idx > -1) {
                        crushed = crushed.replace(groups[i], String.fromCharCode(idx + ctrlCharSet2Delta));
                        break;
                    }
                }
            }
        }
        return crushed;
    }
    return lineText;
}

export function crushControlCharsVice(lineText: string): string {
    return crushControlCharsInternal(lineText, 0, 128);
}

// https://www.kreativekorp.com/software/fonts/c64/
export function crushControlCharsUnicode(lineText: string): string {
    return crushControlCharsInternal(lineText, 128 + 57344, 128 + 57344 + 64);
}

export function controlCharCodeHex(symbolicControlChar: string) {
    return crushControlCharsUnicode(symbolicControlChar).charCodeAt(0).toString(16).toUpperCase();
}

export function changeUpperCaseCharUnicode(lineText: string): string {
    const chars = [...lineText];
    const res = chars.reduce((acc, char) => {
        const regExp = /[A-Z]/;
        const match = regExp.exec(char);
        if (match) {
            acc = `${acc}${String.fromCharCode(char.charCodeAt(0) + 57344)}`;
        } else {
            acc = `${acc}${char}`;
        }
        return acc;
    }, "");
    return res;
}

export function controlCharsObjects() {
    const ctrlCharsObjects = [];
    for (let j = 0; j < ctrlCharSet1[0].length; j++) {
        const c1 = ctrlCharSet1[0][j];
        if (c1 && c1 !== "\n") {
            const name = c1;
            const id = 128 + 57344 + j;
            const unicode = String.fromCodePoint(id);
            const ctrlChar = new SpecialCharacter(
                {
                    id: j,
                    name,
                    label: name,
                    symbolic: `{${c1}}`,
                    unicode,
                    description: ctrlCharSetDescription[`c${j}`] || "",
                    synonyms: []
                });
            for (let i = 1; i < ctrlCharSet1.length; i++) {
                const synonym = ctrlCharSet1[i][j];
                if (synonym && synonym !== ctrlChar.name && ctrlChar.synonyms.indexOf(synonym) === -1) {
                    ctrlChar.synonyms.push(synonym);
                }
            }
            ctrlCharsObjects.push(ctrlChar);
        }
    }
    for (let j = 0; j < ctrlCharSet2[0].length; j++) {
        const c1 = ctrlCharSet2[0][j];
        if (c1 && c1 !== "\n") {
            const name = c1;
            const id = 128 + 57344 + 64 + j;
            const unicode = String.fromCodePoint(id);
            const ctrlChar = new SpecialCharacter(
                {
                    id: j + 128,
                    name,
                    label: name,
                    symbolic: `{${c1}}`,
                    unicode,
                    description: ctrlCharSetDescription[`c${j + 128}`] || "",
                    synonyms: []
                });
            for (let i = 1; i < ctrlCharSet2.length; i++) {
                const synonym = ctrlCharSet2[i][j];
                if (synonym && synonym !== ctrlChar.name && ctrlChar.synonyms.indexOf(synonym) === -1) {
                    ctrlChar.synonyms.push(synonym);
                }
            }
            ctrlCharsObjects.push(ctrlChar);
        }
    }
    return ctrlCharsObjects;
}

interface ISnippet {
    prefix: string[],
    body: string[],
    description: string,
}

export function exportSnippets() {
    const snippets = new Map<string, ISnippet>();

    for (let j = 0; j < ctrlCharSet1[0].length; j++) {
        const c1 = ctrlCharSet1[0][j];
        if (c1 && c1 !== "\n") {
            const key1 = `{${c1}}`;
            const key2 = `chr$(${j})`;
            const body1 = [`{${c1}}$0`];
            const body2 = [`chr$(${j})$0`];
            const snippet = {
                prefix: [`{${c1}}`],
                description: ctrlCharSetDescription[`c${j}`] || "-"
            };
            for (let i = 1; i < ctrlCharSet1.length; i++) {
                const synonym = ctrlCharSet1[i][j];
                if (synonym && synonym !== c1 && snippet.prefix.indexOf(synonym) === -1) {
                    snippet.prefix.push(`{${synonym}}`);
                }
            }
            snippets.set(key1, { ...snippet, body: body1 });
            snippets.set(key2, { ...snippet, body: body2 });
        }
    }
    for (let j = 0; j < ctrlCharSet2[0].length; j++) {
        const c1 = ctrlCharSet2[0][j];
        if (c1 && c1 !== "\n") {
            const key1 = `{${c1}}`;
            const key2 = `chr$(${j + 128})`;
            const body1 = [`{${c1}}$0`];
            const body2 = [`chr$(${j + 128})$0`];
            const snippet = {
                prefix: [`{${c1}}`],
                description: ctrlCharSetDescription[`c${j + 128}`] || "-"
            };
            for (let i = 1; i < ctrlCharSet2.length; i++) {
                const synonym = ctrlCharSet2[i][j];
                if (synonym && synonym !== c1 && snippet.prefix.indexOf(synonym) === -1) {
                    snippet.prefix.push(i === 4 ?  synonym :`{${synonym}}`);
                }
            }
            snippets.set(key1, { ...snippet, body: body1 });
            snippets.set(key2, { ...snippet, body: body2 });
        }
    }
    fs.writeFileSync("./snpts.json", JSON.stringify(Object.fromEntries(snippets)));
    return snippets;
}

