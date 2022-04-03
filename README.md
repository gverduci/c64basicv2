![c64basicv2 logo](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_logo.png)

# **** COMMODORE 64 BASIC V2 **** (c64basicv2) Visual Studio Code Extension

This extension helps you to write *Commodore 64 basic v2* programs. It provides you: syntax highlighting, snippets, file icons, a theme, tasks, and rulers.

Rules for snippets come from the following pages of C64-Wiki:
- [BASIC](https://www.c64-wiki.com/wiki/BASIC#Overview_of_BASIC_Version_2.0_.28second_release.29_Commands) 
- [Control character](https://www.c64-wiki.com/wiki/control_character) 

You might follow this process to develop your program:
1. write the program;
2. test it with [vice](https://vice-emu.sourceforge.io/) using the following task named "Run C64_BASIC prg";
3. create a d64 image using the "created64.sh" script (see next sections of this README);
4. use this d64 image with a sd2iec device;
5. run it on the real c64 hardware.

## Features

The provided features are:

- Syntax highlighting
- Snippets for the main commands and control characters
- File icons
- Theme
- Rulers: 40th and 80th column
- Tasks: suggested in this README

### Syntax highlighting
An example of syntax highlighting is:

![c64basicv2 highlighting](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_syntaxhighlighting.png)

### Snippets

Snippets suggest to you the syntax of the commands:

![c64basicv2 Snippets](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_snippet.png)

### Snippets for Control characters
Control characters in c64 basic are special characters like this:

![c64basicv2 logo](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/clrCtrlChar.png)

Books and old magazines represent special characters using this syntax: {ctrl character name}. For example, the previous character is written with this syntax: {clr}.

If you use this control character in a print statement (print "{clr}"), c64 clears the screen.

You can find the list of control characters on this page: [Control character](https://www.c64-wiki.com/wiki/control_character).

Snippets for Control character transform string like {clr} to the correspondig command chr$(xxx). In our example: chr$(147).

## Task Settings

Configure `tasks.json` and hit Crtl+Shift+B to convert/run the currently open basic program file to a C64 prg with the same name.
Install *vice* to use *petcat* and *x64sc*.

```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Convert between ASCII, PETSCII and tokenized BASIC",
            "type": "shell",
            "linux": {
                "command": "/usr/bin/petcat -wsimon -o ./bin/${fileBasename} -- ${file}"
            },
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "options": {
                "cwd": "${config:c64basic.vice}"
            }
        },
        {
            "label": "Run C64_BASIC prg",
            "type": "shell",
            "linux": {
                "command": "/usr/bin/petcat -wsimon -o ./bin/${fileBasename} -- ${file} & /usr/bin/x64sc ./bin/${fileBasename}"
            },
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

## Other usefull info and script

*Folder structure*

```
\    -> root dir
\bin -> converted programs
\src -> source programs
```

*convertAll.sh*: to convert all the prg (src folder) between ASCII, PETSCII and tokenized BASIC.

```bash
#!/bin/bash
for filename in ./src/*.prg; do
    SOURCE=$(echo $filename)
    echo $SOURCE
    DEST=$(echo ${SOURCE##*/})
    echo $DEST
    petcat -wsimon -o ./bin/$DEST -- $SOURCE
done
```

*created64.sh*: to create a d64 image disk containing all the converted prg

```bash
#!/bin/bash
c1541 -format "diskname,1" d64 ./d64/diskname.d64
for filename in ./bin/*.prg; do
    SOURCE=$(echo $filename)
    echo $SOURCE
    DEST=$(echo ${SOURCE##*/})
    echo $DEST
    c1541 ./d64/diskname.d64 -write $filename $DEST
done
```

Install *vice* to use *petcat*, *x64sc* and *c1541*.

## Release Notes

### 0.1.1

Initial release of `c64basicv2` extension.
