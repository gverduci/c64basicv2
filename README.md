![c64basicv2 logo](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_logo.png)

# **** COMMODORE 64 BASIC V2 **** (c64basicv2) Visual Studio Code Extension

This extension helps you to write *Commodore 64 basic v2* programs (.prg or .bas extension). It provides you: syntax highlighting, snippets, file icons, a theme, tasks, rulers, commands, a control characters view, and a simple preview.

Rules for snippets come from the following pages of [C64-Wiki](https://www.c64-wiki.com/):
- [BASIC](https://www.c64-wiki.com/wiki/BASIC#Overview_of_BASIC_Version_2.0_.28second_release.29_Commands) 
- [Control character](https://www.c64-wiki.com/wiki/control_character) 

You might follow this process to develop your program:
1. create a folder structure like this:

        \    -> root dir
        \bin -> converted programs
        \src -> source programs

2. write the program;
3. test it with [Vice](https://vice-emu.sourceforge.io/) using the "Convert and Run" command;
4. create a d64 image using the "created64.sh" script (see next sections of this README);
5. use this d64 image with a sd2iec device;
6. run it on the real c64 hardware.

You can create the folder structure using [Yeoman](https://yeoman.io/learning/):

```bash
npm install -g generator-c64basicv2

mkdir myC64Project
cd myC64Project

npx yo c64basicv2

```

## Features

The provided features are:

- Syntax highlighting
- Snippets for the main commands and control characters
- File icons
- Theme
- Rulers: 40th and 80th column
- Tasks: suggested in this README
- Command: Automatic Proofreader, Convert, Convert and Run
- Keyboard Shortcuts
- Control character view in the Primary Sidebar 
- Sid info view (address and ADSR calculator) in the Primary Sidebar  
- Code preview

### Syntax highlighting
An example of syntax highlighting is:

![c64basicv2 highlighting](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_syntaxhighlighting.png)

### Snippets

Snippets suggest to you the syntax of the commands:

![c64basicv2 Snippets](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_snippets.gif)

### Snippets for Control characters
Control characters in c64 basic are special characters like this:

![c64basicv2 logo](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/clrCtrlChar.png)

Books and old magazines represent special characters using the symbolic syntax: {ctrl character name}. For example, the previous character is written with this syntax: {clr}.

If you use this control character in a print statement (print "{clr}"), c64 clears the screen.

You can find the list of control characters on this page: [Control character](https://www.c64-wiki.com/wiki/control_character).

Snippets for Control character suggest a symbolic character or the corresponding chr$(xxx). In our example: chr$(147).

If you use the chr$ mode, pay attention: Inside a *print* statement, you have to remove the double apex, print "{clr}" become print {clr} and then print chr$(147).

![c64basicv2 Control Character Snippet](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_ctrlcharsnippets.gif)

The best option is using the symbolic representation, *petcat* will convert the symbol for you. *petcat* recognize the following symbols:
```
{CTRL-A}    {CTRL-B}    {stop}      {CTRL-D}    {wht}   {CTRL-F}    {CTRL-G}
{dish}      {ensh}      {CTRL-K}    {CTRL-L}    {swlc}  {CTRL-O}
{CTRL-P}    {down}      {rvon}      {home}      {del}   {CTRL-U}    {CTRL-V}     {CTRL-W}
{CTRL-X}    {CTRL-Y}    {CTRL-Z}    {esc}       {red}   {rght}      {grn}        {blu}

{orng}      {f1}        {f3}        {f5}
{f7}        {f2}        {f4}        {f6}        {f8}    {sret}      {swuc}
{blk}       {up}        {rvof}      {clr}       {inst}  {brn}       {lred}       {gry1}
{gry2}      {lgrn}      {lblu}      {gry}       {pur}   {left}      {yel}        {cyn}
```
Other details: [petcat src](https://github.com/svn2github/vice-emu/blob/524c58c4c2159dbe82520d36b7dde6a082eeddf7/vice/src/petcat.c#L683)

### Command - Automatic Proofreader (Keyboard Shortcut: ctrl+shift+p ctrl+shift+r)
Automatic Proofreader is an error-checking command that helps you to type program listings without mistakes.

This command emulates (I hope) the original "The Automatic Proofreader" program published on COMPUTE!'s Gazette. 

An example:

![c64basicv2 Automatic Proofreader](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/proofreaderEx.png)

Hit "F1", search "Automatic Proofreader" and press "enter": a popup shows the checksum for the current line.

Since version 0.5.0, "Automatic Proofreader" is displayed on each row after the 80th column.

![c64basicv2 Automatic Proofreader inline](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/proofreaderInlineEx.png)

For others info on "The Automatic Proofreader" original program see [Wikipedia](https://en.wikipedia.org/wiki/The_Automatic_Proofreader).

### Command - Convert (Keyboard Shortcut: ctrl+shift+b)
Use this command to convert the current program to tokenized BASIC using the Vice petcat command.
Needed settings:
- c64basicv2.petcat           - default value: /usr/bin/petcat
- c64basicv2.convertOutputDir - default value: bin

Hit "F1", search "Convert" and press "enter".

### Command - Convert and Run (Keyboard Shortcut: f5)
Convert and run the current program using the Vice x64sc command.
Needed settings:
- c64basicv2.x64sc            - default value: /usr/bin/x64sc

Hit F1, search "Convert and Run" then hit enter.

### CHARACTERS view on the Primary Sidebar 
Using the Control characters view in the Primary Sidebar, you can visually add a control character:

![c64basicv2 Control Characters View](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_ctrlCharView.png)

Click on the character to add in the code the corresponding symbol or click on the number to add the chr$ command.

### SID REGISTER view (address and ADSR calculator) in the Primary Sidebar
Using this view, you can show Sid registries and add the poke command directly in the code:

![c64basicv2 Control Characters View](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_sidRegView.png)

The ADSR section allow you to select the desired envelope and add the calculated value in the code:

![c64basicv2 Control Characters View](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_sidADSRView)

### Preview
Using the preview button on the editor Toolbar, you can show a panel containing your code formatted like the C64 screen. This view is useful for checking control characters.

![c64basicv2 Preview](https://raw.githubusercontent.com/gverduci/c64basicv2/main/images/c64basicv2_preview.png)

The preview uses the "Pet Me 64" font released by [Kreative Korporation](https://www.kreativekorp.com/software/fonts/c64/).

### Diagnostic
Check lines for errors and warnings. 

Checks implemented:

| Code               | Description                                                                                      | Type              |
| ------------------ | ------------------------------------------------------------------------------------------------ | ----------------- |
| `OVER80`           | Warns that lines with more than 80 characters cannot be edited in c64, but the program will run  | warning           |
| `LINENUN`          | Warns that the missing line number will be entered by petcat                                     | warning           |

## Settings

| Name                                        | Description                                                           | Default value   |
| ------------------------------------------- | --------------------------------------------------------------------- | --------------- |
| `c64basicv2.petcat`                         | Vice petcat command path                                              | /usr/bin/petcat |
| `c64basicv2.convertOutputDir`               | output dir                                                            | bin             |
| `c64basicv2.x64sc`                          | Vice x64sc command path                                               | /usr/bin/x64sc  |
| `c64basicv2.showCommandLogs`                | Enable log diagnostics for commands (OUTPUT Window)                   | true            |
| `c64basicv2.showInlineAutomaticProofreader` | Enable inline Automatic Proofreader                                   | false           |
| `c64basicv2.enableDiagnostics`              | Enable diagnostics for c64 basic v2 text files                        | false           |
| `c64basicv2.showCtrlCharacterInfo`          | Enable control character info on mouse hover                          | false           |

## Task Settings

Commands "Convert" and "Convert and Run" replace task settings.

Configure `tasks.json` and hit Crtl+Shift+B to convert/run the currently open basic program file to a C64 program with the same name.
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
                "command": "/usr/bin/petcat -w2 -o ./bin/${fileBasename} -- ${file}"
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
                "command": "/usr/bin/petcat -w2 -o ./bin/${fileBasename} -- ${file} & /usr/bin/x64sc ./bin/${fileBasename}"
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

*convertAll.sh*: to convert all the programs (src folder) between ASCII, PETSCII, and tokenized BASIC.

```bash
#!/bin/bash
for filename in ./src/*.prg; do
    SOURCE=$(echo $filename)
    echo $SOURCE
    DEST=$(echo ${SOURCE##*/})
    echo $DEST
    petcat -w2 -o ./bin/$DEST -- $SOURCE
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

To extract a prg from a d64 image disk and convert it to a text file:

```bash
c1541 diskname.d64 -read "file name" filename.prg
petcat -2 -o filename.prg.txt -- filename.prg
```

Install *vice* to use *petcat*, *x64sc* and *c1541*.

*IMPORTANT*
If you use vice on *Ubuntu* remenber to install bin files (kernal, basic, etc.):
- download the zip for Window
- extract files
- copy all folders to /usr/share/vice (leaving out bin)

## Release Notes

[CHANGELOG.md](./CHANGELOG.md)
