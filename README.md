![c64basicv2 logo](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_logo.png)

# **** COMMODORE 64 BASIC V2 **** (c64basicv2) Visual Studio Code Extension

Syntax highlighting, snippets, file icon, theme, tasks for *Commodore 64 basic v2*.

## Features

- Syntax highlighting
- Snippets for the main commands and control characters
- File icons
- Theme
- Rulers (40th and 80th column)
- Tasks (in this README)

![c64basicv2 logo](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_syntaxhighlighting.png)

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
