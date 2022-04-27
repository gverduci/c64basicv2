// Control codes from Vice project (petcat.c)
// https://sourceforge.net/p/vice-emu/code/HEAD/tree/trunk/vice/src/tools/petcat/petcat.c#l669
//
const ctrlCharSet1 = [
	/* 0x00 - 0x1f (petcat) */
	[
		"",              "CTRL-A",         "CTRL-B",     "stop",   "CTRL-D", "wht",    "CTRL-F",     "CTRL-G",
		"dish",          "ensh",           "\n",         "CTRL-K", "CTRL-L", "\n",     "swlc",       "CTRL-O",
		"CTRL-P",        "down",           "rvon",       "home",   "del",    "CTRL-U", "CTRL-V",     "CTRL-W",
		"CTRL-X",        "CTRL-Y",         "CTRL-Z",     "esc",    "red",    "rght",   "grn",        "blu"
	],
	/* 0x00 - 0x1f (FIXME: MikroBITTI) */
	[
		"",              "",               "",           "",       "",       "WHT",    "",           "",
		"up/lo lock on", "up/lo lock off", "",           "",       "",       "return", "lower case", "",
		"",              "DOWN",           "RVS ON",     "HOME",   "delete", "",       "",           "",
		"",              "",               "",           "esc",    "RED",    "RIGHT",  "GRN",        "BLU"
	],
	/* 0x00 - 0x1f */
	[
		"",              "",               "",           "",       "",       "",       "",           "",
		"",              "",               "",           "",       "",       "",       "",           "",
		"",              "",               "REVERSE ON", "",       "",       "",       "",           "",
		"",              "",               "",           "",       "",       "",       "",           ""
	],
	/* 0x00 - 0x1f (tok64) */
	[
		"",              "",               "",           "",       "",       "white",  "",           "",
		"",              "",               "",           "",       "",       "",       "",           "",
		"",              "down",           "reverse on", "home",   "",       "",       "",           "",
		"",              "",               "",           "",       "red",    "right",  "green",      "blue"
	],
	/* 0x00 - 0x1f (64er/checksummer v3) */
	[
		"",              "",               "",           "",       "",       "WHITE",  "",           "",
		"",              "",               "",           "",       "",       "RETURN", "",           "",
		"",              "DOWN",           "RVSON",      "HOME",   "DEL",    "",       "",           "",
		"",              "",               "",           "",       "RED",    "RIGHT",  "GREEN",      "BLUE"
	]
];

const ctrlCharSet2 = [
	/* 0x80 - 0x9f (petcat) */
	[
		"",     "orng",         "",            "",           "",       "f1",           "f3",         "f5",
		"f7",   "f2",           "f4",          "f6",         "f8",     "sret",         "swuc",       "",
		"blk",  "up",           "rvof",        "clr",        "inst",   "brn",          "lred",       "gry1",
		"gry2", "lgrn",         "lblu",        "gry3",       "pur",    "left",         "yel",        "cyn"
	],
	/* 0x80 - 0x9f (FIXME: MikroBITTI) */
	[
		"",      "orange",      "",            "",           "",       "F1",           "F3",         "F5",
		"F7",    "F2",          "F4",          "F6",         "F8",     "shift return", "upper case", "",
		"BLK",   "UP",          "RVS OFF",     "CLR",        "insert", "BROWN",        "LT.RED",     "GREY1",
		"GREY2", "lt green",    "LT.BLUE",     "GREY3",      "PUR",    "LEFT",         "YEL",        "cyn"
	],
	/* 0x80 - 0x9f (tok64) */
	[
		"",      "orange",      "",            "",           "",        "f1",          "f3",         "r5",
		"f7",    "f2",          "f4",          "f6",         "f8",      "",            "",           "",
		"black", "up",          "reverse off", "clear",      "",        "brown",       "pink",       "dark gray",
		"gray",  "light green", "light blue",  "light gray", "purple",  "left",        "yellow",     "cyan",
	],
	/* 0x80 - 0x9f (64er/Checksummer v3) */
	[
		"",      "ORANGE",      "",            "",           "",        "F1",          "F3",         "F5",
		"F7",    "F2",          "F4",          "F6",         "F8",      "",            "",           "",
		"BLACK", "UP",          "RVSOFF",      "CLR",        "INST",    "BROWN",       "LIG.RED",    "GREY 1",
		"GREY 2","LIG.GREEN",   "LIG.BLUE",    "GREY 3",     "PURPLE",  "LEFT",        "YELLOW",     "CYAN",
	]
];

function crushControlChars(lineText: string): string {
	const containsCommand = lineText.indexOf('{') > -1;
	if (containsCommand){
		const groups: string[] = [];
		const regExp = /\{(\w+|-|\s|\d+|\/|\.)*\}/gi;
		let match = regExp.exec(lineText);
		let crushed = lineText;
		while (match!== null) {
			if (match.index === regExp.lastIndex) {
				regExp.lastIndex++;
			}
			
			match.forEach((m, groupIndex) => {
				groups.push(m);
			});
			match = regExp.exec(crushed);
		}

		// groups contains: ["{CLR}", "CLR", "{WHT}", "WHT", ...]
		//                      ^       ^
		//                      |       |
		//              to replace     to search in ctrlCharSet1/ctrlCharSet2
		for (let i = 0; i<groups.length; i+=2){
			let finded = false;
			for (let j = 0; j<ctrlCharSet1.length; j++){
				const c1 = ctrlCharSet1[j];
				const idx = c1.findIndex(element => {
					return element.toLowerCase() === groups[i+1].toLowerCase();
				  });
				if (idx>-1){
					crushed=crushed.replace(groups[i], String.fromCharCode(idx));
					finded=true;
					break;
				}
			};
			if (!finded){
				for (let k = 0; k<ctrlCharSet2.length; k++){
					const c2 = ctrlCharSet2[k];
					const idx = c2.findIndex(element => {
						return element.toLowerCase() === groups[i+1].toLowerCase();
					  });
					if (idx>-1){
						crushed=crushed.replace(groups[i], String.fromCharCode(idx+128));
						break;
					}
				};
			}
		}
		return crushed;
	}
	return lineText;
}

const sum = (line: string) =>{
	let sum = 0;
	const crushedLine = crushControlChars(line.toUpperCase());
	for (let index = 0; index < crushedLine.length; index++) {
		sum=sum+crushedLine.toUpperCase().charCodeAt(index);
		if(sum > 255){
			sum = sum % 256;
		}
	}
	return sum;
};

export function automaticProofreader (line: string) {
	let checksum = -1;
	if (line) {
		const trimmedLine = line.trim().replace(/ /g,"");
		checksum = sum(trimmedLine);
	}
	return checksum;
};
