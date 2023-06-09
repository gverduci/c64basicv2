import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { INote } from "./models/models";
import { FC, ReactElement, useCallback, useEffect, useState } from "react";
import { INoteSystemView } from "./models/viewModels";
import Key from "./key";
import "../../node_modules/@vscode/codicons/dist/codicon.css";
import "../../node_modules/@vscode/codicons/dist/codicon.ttf";

const generateNotesWindow = (notes: INote[], startNote: number) => {
  // 8  octave 0..7
  // 12 notes 0..11
  // 0  1   2  3   4  5  6   7  8   9  10  11
  // 0      1      2  3      4      5      6
  // C, C#, D, D#, E, F, F#, G, G#, A, A#, B
  //    2      3         5      6      7
  // q      w      e  r      t      y      u
  const keysBlack = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const keysWhite = ["q", "w", "e", "r", "t", "y", "u"];
  const keys: string[] = [];
  const notesWin: INote[] = [];
  const startOctave: number = Math.floor(startNote / 12);
  const firstNote: number = startNote % 12;
  let noteIndex: number = firstNote;
  let octaveIndex: number = startOctave;
  if (notes.length > 0) {
    let indexKeyW = 0;
    let indexKeyB = 0;
    while (notesWin.length < 12) {
      const curr: INote = { ...notes[noteIndex], values: [] };
      if (octaveIndex < 8) {
        const note = notes[noteIndex];
        curr.values.push(note.values[octaveIndex]);
        if (note.note.indexOf("#") > -1) {
          keys.push(keysBlack[indexKeyB]);
          indexKeyB = indexKeyB + 1;
        } else {
          keys.push(keysWhite[indexKeyW]);
          if (
            note.note === "E" ||
            note.note === "H" ||
            (indexKeyB === 0 && indexKeyW === 0)
          )
            indexKeyB = indexKeyB + 1;
          indexKeyW = indexKeyW + 1;
        }
      } else {
        curr.values.push({
          octave: octaveIndex,
          dec: 0,
          hi: 0,
          lo: 0,
        });
      }
      notesWin.push(curr);
      if (noteIndex === 11) {
        octaveIndex = octaveIndex + 1;
        noteIndex = -1;
      }
      noteIndex = noteIndex + 1;
    }
  }
  return { keys, notesWin };
};

const OCTAVE_INIT = 4;

const System: FC<INoteSystemView> = ({
  notes,
  info,
  system,
  currentSystem,
  setCurrentNoteValues,
}): ReactElement => {
  const [startNote, setStartNote] = useState(OCTAVE_INIT * 12);
  const { keys, notesWin } = generateNotesWindow(notes, startNote);

  const handleIncr = (newStartNote: number) => {
    if (newStartNote < 0) setStartNote(0);
    else if (newStartNote > 12 * 7) setStartNote(12 * 7);
    else setStartNote(newStartNote);
  };

  const handleClick = useCallback(
    (note: INote) => {
      setCurrentNoteValues(note.values[0].hi, note.values[0].lo);
    },
    [setCurrentNoteValues],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      const noteIndex = keys.indexOf(key);

      if (noteIndex > -1 && currentSystem === system) {
        // handleClick call only for current tab (system)
        handleClick(notesWin[noteIndex]);
        console.log(`${key} - ${notesWin[noteIndex].note}`);
      }
    };

    // this event is added for each panel ("pal" and "ntsc"),
    // so onKeyDown will be called 2 times for each key pressed
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [notesWin, keys, currentSystem, system, handleClick]);

  return (
    <div style={{ display: "block" }}>
      <div>{info}</div>
      <div
        style={{ background: "#cacaca", display: "flex", paddingLeft: "15px" }}
      >
        {notesWin.map((n, i) => (
          <Key
            note={n.note}
            octave={n.values[0].octave}
            keyButton={keys && keys.length > 0 ? keys[i] : ""}
            onClick={() => {
              handleClick(n);
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: "4px", display: "flex", flexFlow: "nowrap" }}>
        <VSCodeButton
          id="decOct"
          appearance="secondary"
          onClick={() => handleIncr(startNote - 12)}
        >
          <span
            className="codicon codicon-fold-down"
            style={{ transform:"rotate(90deg)" }}
          ></span>
          octave
        </VSCodeButton>
        <VSCodeButton
          id="decNote"
          appearance="secondary"
          onClick={() => handleIncr(startNote - 1)}
        >
          <span className="codicon codicon-chevron-left"></span>note
        </VSCodeButton>
        <VSCodeButton
          id="incNote"
          appearance="secondary"
          onClick={() => handleIncr(startNote + 1)}
        >
          note
          <span className="codicon codicon-chevron-right"></span>
          {/*⟩*/}
        </VSCodeButton>
        <VSCodeButton
          id="incOct"
          appearance="secondary"
          onClick={() => handleIncr(startNote + 12)}
        >
          octave
          <span
            className="codicon codicon-fold-down"
            style={{ transform:"rotate(-90deg)" }}
          ></span>
        </VSCodeButton>
      </div>
      <div style={{ marginTop: "4px", display: "flex", flexFlow: "nowrap" }}>
        <div>
          <VSCodeButton
            id="pause"
            onClick={() =>
              handleClick({
                note: "",
                synonym: "",
                values: [{ octave: 0, dec: 0, hi: 0, lo: 0 }],
              })
            }
          >
            pause
          </VSCodeButton>
        </div>
        <div>
          <VSCodeButton
            id="end"
            onClick={() =>
              handleClick({
                note: "",
                synonym: "",
                values: [{ octave: 0, dec: -1, hi: -1, lo: -1 }],
              })
            }
          >
            end
          </VSCodeButton>
        </div>
      </div>
    </div>
  );
};

export default System;
