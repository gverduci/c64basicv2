import React, {
  FC,
  ReactElement,
  useState,
  useEffect,
  useCallback,
} from "react";
import { vscode } from "./utilities/vscode";
import {
  VSCodeDataGrid,
  VSCodeDataGridRow,
  VSCodeDataGridCell,
  VSCodePanels,
  VSCodePanelTab,
  VSCodePanelView,
  VSCodeButton,
} from "@vscode/webview-ui-toolkit/react";
import Title from "webview-common/build/Title";
import Subtitle from "webview-common/build/Subtitle";
import { INoteSystem, INote } from "./models/note";
import note from "./data/note.json";
import { VSCodeDropdown } from "@vscode/webview-ui-toolkit/react";
import { VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import { Tabs } from "@microsoft/fast-foundation";

import "./App.css";
import StepperSection from "./common/StepperSection";

interface IButtonNote {
  noMargin?: boolean;
  note: string;
  octave: number;
  keyButton: string;
  onClick: () => any;
}

interface IButtonLabel {
  note: string;
  octave: number;
  keyButton: string;
  onClick: () => any;
}

interface INoteView {
  note: string;
  octave: number;
  keyButton: string;
  onClick: () => any;
}

interface INoteSystemView extends INoteSystem {
  currentSystem: string;
  setCurrentNoteValues: (hi: number, lo: number) => any;
}

interface ICurrentNote {
  hi: number;
  lo: number;
  dr: number;
}

const NoteWhite: FC<IButtonNote> = ({
  noMargin,
  note,
  octave,
  keyButton,
  onClick,
}) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "end",
      zIndex: 99,
      color: "#000000",
      width: "40px",
      height: "100px",
      border: "1px solid black",
      marginLeft: noMargin ? "0" : "-15px",
      fontSize: "0.75rem",
    }}
    className="noteButtonWhite"
  >
    <span
      style={{ whiteSpace: "pre" }}
    >{`${note}${octave}\n(${keyButton})`}</span>
  </button>
);

const NoteBlack: FC<IButtonNote> = ({
  noMargin,
  note,
  octave,
  keyButton,
  onClick,
}) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "end",
      zIndex: 100,
      color: "#FFFFFF",
      width: "30px",
      height: "60px",
      marginLeft: noMargin ? "0" : "-15px",
      fontSize: "0.75rem",
    }}
    className="noteButtonBlack"
  >
    <span
      style={{ whiteSpace: "pre" }}
    >{`${note}${octave}\n(${keyButton})`}</span>
  </button>
);

const NoteC: FC<IButtonLabel> = ({ note, octave, keyButton, onClick }) => (
  <NoteWhite
    onClick={onClick}
    noMargin
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const NoteCSharp: FC<IButtonLabel> = ({ note, octave, keyButton, onClick }) => (
  <NoteBlack
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const NoteD: FC<IButtonLabel> = ({ note, octave, keyButton, onClick }) => (
  <NoteWhite
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const NoteDSharp: FC<IButtonLabel> = ({ note, octave, keyButton, onClick }) => (
  <NoteBlack
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const NoteE: FC<IButtonLabel> = ({ note, octave, keyButton, onClick }) => (
  <NoteWhite
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const NoteF: FC<IButtonLabel> = ({ note, octave, keyButton, onClick }) => (
  <NoteWhite
    onClick={onClick}
    noMargin
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const NoteFSharp: FC<IButtonLabel> = ({ note, octave, keyButton, onClick }) => (
  <NoteBlack
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const NoteG: FC<IButtonLabel> = ({ note, octave, keyButton, onClick }) => (
  <NoteWhite
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const NoteGSharp: FC<IButtonLabel> = ({ note, octave, keyButton, onClick }) => (
  <NoteBlack
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const NoteA: FC<IButtonLabel> = ({ note, octave, keyButton, onClick }) => (
  <NoteWhite
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const NoteASharp: FC<IButtonLabel> = ({ note, octave, keyButton, onClick }) => (
  <NoteBlack
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const NoteH: FC<IButtonLabel> = ({ note, octave, keyButton, onClick }) => (
  <NoteWhite
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);

const Note: FC<INoteView> = ({ note, octave, keyButton, onClick }) => {
  switch (note) {
    case "C":
      return (
        <NoteC
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "C#":
      return (
        <NoteCSharp
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "D":
      return (
        <NoteD
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "D#":
      return (
        <NoteDSharp
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "E":
      return (
        <NoteE
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "F":
      return (
        <NoteF
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "F#":
      return (
        <NoteFSharp
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "G":
      return (
        <NoteG
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "G#":
      return (
        <NoteGSharp
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "A":
      return (
        <NoteA
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "A#":
      return (
        <NoteASharp
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "H":
      return (
        <NoteH
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    default:
      return null;
  }
};

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
          <Note
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
            style={{ rotate: "90deg" }}
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
            style={{ rotate: "-90deg" }}
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

/**
 * https://archive.org/details/Compute_s_All_About_the_Commodore_64_Volume_Two/page/284/mode/2up
 */
const bpmJiffies = [
  { mm: 900, w: 16, h: 8, q: 4, e: 2, s: 1, t32: 0, t64: 0 },
  { mm: 600, w: 24, h: 12, q: 6, e: 3, s: 0, t32: 0, t64: 0 },
  { mm: 450, w: 32, h: 16, q: 8, e: 4, s: 2, t32: 1, t64: 0 },
  { mm: 360, w: 40, h: 20, q: 10, e: 5, s: 0, t32: 0, t64: 0 },
  { mm: 300, w: 48, h: 24, q: 12, e: 6, s: 3, t32: 0, t64: 0 },
  { mm: 257, w: 56, h: 28, q: 14, e: 7, s: 0, t32: 0, t64: 0 },
  { mm: 225, w: 64, h: 32, q: 16, e: 8, s: 4, t32: 2, t64: 1 },
  { mm: 200, w: 72, h: 36, q: 18, e: 9, s: 0, t32: 0, t64: 0 },
  { mm: 180, w: 80, h: 40, q: 20, e: 10, s: 5, t32: 0, t64: 0 },
  { mm: 163, w: 88, h: 44, q: 22, e: 11, s: 0, t32: 0, t64: 0 },
  { mm: 150, w: 96, h: 48, q: 24, e: 12, s: 6, t32: 3, t64: 0 },
  { mm: 138, w: 104, h: 52, q: 26, e: 13, s: 0, t32: 0, t64: 0 },
  { mm: 128, w: 112, h: 56, q: 28, e: 14, s: 7, t32: 0, t64: 0 },
  { mm: 120, w: 120, h: 60, q: 30, e: 15, s: 0, t32: 0, t64: 0 },
  { mm: 112, w: 128, h: 64, q: 32, e: 16, s: 8, t32: 4, t64: 2 },
  { mm: 105, w: 136, h: 68, q: 34, e: 17, s: 0, t32: 0, t64: 0 },
  { mm: 100, w: 144, h: 72, q: 36, e: 18, s: 9, t32: 0, t64: 0 },
  { mm: 94, w: 152, h: 76, q: 38, e: 19, s: 0, t32: 0, t64: 0 },
  { mm: 90, w: 160, h: 80, q: 40, e: 20, s: 10, t32: 5, t64: 0 },
  { mm: 85, w: 168, h: 84, q: 42, e: 21, s: 0, t32: 0, t64: 0 },
  { mm: 81, w: 176, h: 88, q: 44, e: 22, s: 11, t32: 0, t64: 0 },
  { mm: 78, w: 184, h: 92, q: 46, e: 23, s: 0, t32: 0, t64: 0 },
  { mm: 75, w: 192, h: 96, q: 48, e: 24, s: 12, t32: 6, t64: 3 },
  { mm: 72, w: 200, h: 100, q: 50, e: 25, s: 0, t32: 0, t64: 0 },
  { mm: 69, w: 208, h: 104, q: 52, e: 26, s: 13, t32: 0, t64: 0 },
  { mm: 66, w: 216, h: 108, q: 54, e: 27, s: 0, t32: 0, t64: 0 },
  { mm: 64, w: 224, h: 112, q: 56, e: 28, s: 14, t32: 7, t64: 0 },
  { mm: 62, w: 232, h: 116, q: 58, e: 29, s: 0, t32: 0, t64: 0 },
  { mm: 60, w: 240, h: 120, q: 60, e: 30, s: 15, t32: 0, t64: 0 },
  { mm: 58, w: 248, h: 124, q: 62, e: 31, s: 0, t32: 0, t64: 0 },
  { mm: 56, w: 256, h: 128, q: 64, e: 32, s: 16, t32: 8, t64: 4 },
];

const DEFAULT_BPM = 112;

const tempoBpm = [
  { tempo: "Larghissimo", min: 0, max: 20 },
  { tempo: "Grave", min: 21, max: 40 },
  { tempo: "Lento", min: 41, max: 45 },
  { tempo: "Largo", min: 46, max: 50 },
  { tempo: "Adagio", min: 51, max: 60 },
  { tempo: "Adagietto", min: 61, max: 70 },
  { tempo: "Andante", min: 71, max: 85 },
  { tempo: "Moderato", min: 86, max: 97 },
  { tempo: "Allegretto", min: 98, max: 109 },
  { tempo: "Allegro", min: 110, max: 132 },
  { tempo: "Vivace", min: 133, max: 140 },
  { tempo: "Presto", min: 141, max: 177 },
  { tempo: "Prestissimo", min: 178, max: 240 },
  { tempo: "Prestissimo", min: 241, max: 10000 },
];

const getDataValue = (currentNoteValues: ICurrentNote[]) => {
  return currentNoteValues.reduce((acc, curr, i) => {
    const note = `${curr.hi},${curr.lo},${curr.dr}`;
    if (i === 0) acc = `data ${note}`;
    else if (i % 3 === 0) acc = `${acc}\ndata ${note}`;
    else acc = `${acc},${note}`;
    return acc;
  }, "");
};

const Notes: FC = () => {
  const noteSystems: INoteSystem[] = note;
  const [bpm, setBpm] = useState(`${DEFAULT_BPM}`);
  const [currentJiffie, setCurrentJiffie] = useState(
    (bpmJiffies.find((x) => x.mm === DEFAULT_BPM) || { w: 128 }).w,
  );
  const [currentJiffieIdx, setCurrentJiffieIdx] = useState(0);
  const [jiffies, setJiffies] = useState(
    Object.values(bpmJiffies.find((x) => x.mm === DEFAULT_BPM) || {}).slice(1),
  );
  const [currentNoteValues, setCurrentNoteValues] = useState<ICurrentNote[]>(
    [],
  );
  const [currentSystem, setCurrentSystem] = useState("pal");

  const handleAdd = () => {
    const value = getDataValue(currentNoteValues);
    vscode.postMessage({
      command: "text",
      text: value,
    });
  };
  const handleDel = () => {
    setCurrentNoteValues(currentNoteValues.slice(0, -1));
  };

  const handleClr = () => {
    setCurrentNoteValues([]);
  };

  const handleBpm = (evt: Event | React.FormEvent<HTMLElement>) => {
    const element = evt.target as HTMLInputElement;
    setBpm(element.value);
    const jiffiesObj = bpmJiffies.find((r) => `${r.mm}` === element.value);
    setJiffies(jiffiesObj ? Object.values(jiffiesObj).slice(1) : []);
    setCurrentJiffie(jiffiesObj ? jiffiesObj.w : 128);
    setCurrentJiffieIdx(0);
  };

  const handleJiffie = (jiffie: number, index: number) => {
    if (jiffie) {
      setCurrentJiffie(jiffie);
      setCurrentJiffieIdx(index);
    };
  };

  const handleCurrentNote = (hi: number, lo: number, dr: number) => {
    const newValues = [
      ...currentNoteValues,
      { hi, lo, dr: hi === -1 && lo === -1 ? -1 : dr },
    ];
    setCurrentNoteValues(newValues);
  };

  const handleOnChangeTab = (evt: Event | React.FormEvent<HTMLElement>) => {
    const element = evt.target as Tabs;
    setCurrentSystem(element.activeid);
    handleClr();
  };

  return (
    <>
      <Title text="Notes" />
      <Subtitle text="follow these steps to generate the data for a melody" />

      <StepperSection title="Bpm" subtitle="select a bpm value" description="">
        <VSCodeDropdown
          id="bpm"
          onChange={(e) => {
            handleBpm(e);
          }}
          value={`${bpm}`}
          style={{ height: "28px", width: "150px" }}
        >
          {bpmJiffies.map((t) => {
            const tempo = tempoBpm.find((x) => t.mm >= x.min && t.mm <= x.max);
            return (
              <VSCodeOption key={`${t.mm}`} value={`${t.mm}`}>
                {`${t.mm}${tempo ? ` - ${tempo.tempo}` : ""}`}
              </VSCodeOption>
            );
          })}
        </VSCodeDropdown>
      </StepperSection>

      <StepperSection
        title="Duration"
        subtitle={`select a note duration (dr) for bpm ${bpm}`}
        description="Note durations in terms of time units (jiffies). One jiffy lasts about 1/60 second. Loop on the system variable TI for the duration. 'All about the Commodore 64 - vol. 2' - Chamberlain, Craig"
      >
        <div style={{ display: "block" }}>
          <VSCodeDataGrid>
            <VSCodeDataGridRow gridTemplateColumns="50px 50px 50px 50px 50px 50px 50px">
              {jiffies.map((jiffie, i) => {
                if (jiffie)
                  return (
                    <VSCodeDataGridCell
                      grid-column={i + 1}
                      onClick={() => handleJiffie(jiffie, i)}
                    >
                      <span
                        style={{
                          textAlign: "center",
                          fontSize: "large",
                          fontWeight: i === currentJiffieIdx ? 700 : 400,
                          color:
                            i === currentJiffieIdx
                              ? "var(--button-primary-background)"
                              : "inherit",
                        }}
                      >
                        {String.fromCodePoint(119133 + i)}
                      </span>
                    </VSCodeDataGridCell>
                  );
                return null;
              })}
            </VSCodeDataGridRow>
            <VSCodeDataGridRow gridTemplateColumns="50px 50px 50px 50px 50px 50px 50px">
              {jiffies.map((jiffie, i) => {
                const half = Math.floor(jiffie / 2);
                const dottedJiffie = jiffie % 2 === 0 ? jiffie + half : 0;
                if (dottedJiffie)
                  return (
                    <VSCodeDataGridCell
                      grid-column={i + 1}
                      onClick={() => handleJiffie(dottedJiffie, i + 10)}
                    >
                      <span
                        style={{
                          textAlign: "center",
                          fontSize: "large",
                          fontWeight:
                            i + 10 === currentJiffieIdx ? 700 : 400,
                          color:
                            i + 10 === currentJiffieIdx
                                ? "var(--button-primary-background)"
                                : "inherit",
                        }}
                      >
                        {`${String.fromCodePoint(119133 + i)}.`}
                      </span>
                    </VSCodeDataGridCell>
                  );
                return null;
              })}
            </VSCodeDataGridRow>
            <VSCodeDataGridRow gridTemplateColumns="50px 50px 50px 50px 50px 50px 50px">
              {jiffies.map((jiffie, i) => {
                const half = Math.floor(jiffie / 2);
                const halfHalf = Math.floor(half / 2);
                const dDottedJiffie = jiffie % 2 === 0 && half % 2 === 0 ? jiffie + half + halfHalf : 0;
                if (dDottedJiffie)
                  return (
                    <VSCodeDataGridCell
                      grid-column={i + 1}
                      onClick={() => handleJiffie(dDottedJiffie, i + 20)}
                    >
                      <span
                        style={{
                          textAlign: "center",
                          fontSize: "large",
                          fontWeight:
                            i + 20 === currentJiffieIdx ? 700 : 400,
                          color:
                            i + 20 === currentJiffieIdx
                                ? "var(--button-primary-background)"
                                : "inherit",
                        }}
                      >
                        {`${String.fromCodePoint(119133 + i)}..`}
                      </span>
                    </VSCodeDataGridCell>
                  );
                return null;
              })}
            </VSCodeDataGridRow>
          </VSCodeDataGrid>
          <div>
            Ex:{" "}
            <pre style={{ fontSize: "0.75rem" }}>
              81 if ti &lt; tm+dr then 81;tm = ti
            </pre>
          </div>
        </div>
      </StepperSection>

      <StepperSection
        title="Notes"
        subtitle="compose a melody"
        description="Using the keyboard you select the Frequency low byte (lo), max:the Frequency high byte (hi) for each note"
      >
        <VSCodePanels activeid={currentSystem} onChange={handleOnChangeTab}>
          {noteSystems.map((s) => (
            <VSCodePanelTab id={s.system}>{s.system}</VSCodePanelTab>
          ))}
          {noteSystems.map((s) => (
            <VSCodePanelView id={s.system}>
              <System
                system={s.system}
                currentSystem={currentSystem}
                notes={s.notes}
                info={s.info}
                setCurrentNoteValues={(hi, lo) =>
                  handleCurrentNote(hi, lo, currentJiffie)
                }
              />
            </VSCodePanelView>
          ))}
        </VSCodePanels>
      </StepperSection>

      <StepperSection title="Data" subtitle="add generated data" description="">
        <div>
          <div
            style={{ paddingLeft: "7px", paddingRight: "7px", width: "100%" }}
          >
            <span style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
              {getDataValue(currentNoteValues)}
            </span>
          </div>
          {currentNoteValues.length > 0 && (
            <div style={{ marginTop: "4px", display: "flex", width: "300px" }}>
              <div style={{ flex: "1" }}>
                <VSCodeButton
                  id="del"
                  onClick={handleDel}
                  appearance="icon"
                  aria-label="delete"
                >
                  <span slot="start" className="codicon codicon-discard"></span>
                </VSCodeButton>
                <VSCodeButton
                  id="clr"
                  onClick={handleClr}
                  appearance="icon"
                  aria-label="clear"
                >
                  <span
                    slot="start"
                    className="codicon codicon-clear-all"
                  ></span>
                </VSCodeButton>
              </div>
              <div>
                <VSCodeButton id="add" onClick={handleAdd} appearance="primary">
                  Add code
                  <span className="codicon codicon-chevron-right"></span>
                </VSCodeButton>
              </div>
            </div>
          )}
          {currentNoteValues.length === 0 && (
            <div
              style={{
                color: "var(--vscode-input-placeholderForeground)",
                fontStyle: "italic",
              }}
            >
              data hi,lo,dr,...
            </div>
          )}
        </div>
      </StepperSection>
    </>
  );
};

export default Notes;
