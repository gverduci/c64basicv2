import { FC } from "react";
import { IKeyLabel, IKeyNote, INoteView } from "./models/viewModels";

const WhiteKey: FC<IKeyNote> = ({
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

const BlackKey: FC<IKeyNote> = ({
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

const KeyC: FC<IKeyLabel> = ({ note, octave, keyButton, onClick }) => (
  <WhiteKey
    onClick={onClick}
    noMargin
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const KeyCSharp: FC<IKeyLabel> = ({ note, octave, keyButton, onClick }) => (
  <BlackKey
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const KeyD: FC<IKeyLabel> = ({ note, octave, keyButton, onClick }) => (
  <WhiteKey
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const KeyDSharp: FC<IKeyLabel> = ({ note, octave, keyButton, onClick }) => (
  <BlackKey
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const KeyE: FC<IKeyLabel> = ({ note, octave, keyButton, onClick }) => (
  <WhiteKey
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const KeyF: FC<IKeyLabel> = ({ note, octave, keyButton, onClick }) => (
  <WhiteKey
    onClick={onClick}
    noMargin
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const KeyFSharp: FC<IKeyLabel> = ({ note, octave, keyButton, onClick }) => (
  <BlackKey
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const KeyG: FC<IKeyLabel> = ({ note, octave, keyButton, onClick }) => (
  <WhiteKey
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const KeyGSharp: FC<IKeyLabel> = ({ note, octave, keyButton, onClick }) => (
  <BlackKey
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const KeyA: FC<IKeyLabel> = ({ note, octave, keyButton, onClick }) => (
  <WhiteKey
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const KeyASharp: FC<IKeyLabel> = ({ note, octave, keyButton, onClick }) => (
  <BlackKey
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);
const KeyH: FC<IKeyLabel> = ({ note, octave, keyButton, onClick }) => (
  <WhiteKey
    onClick={onClick}
    note={note}
    octave={octave}
    keyButton={keyButton}
  />
);

const Key: FC<INoteView> = ({ note, octave, keyButton, onClick }) => {
  switch (note) {
    case "C":
      return (
        <KeyC
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "C#":
      return (
        <KeyCSharp
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "D":
      return (
        <KeyD
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "D#":
      return (
        <KeyDSharp
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "E":
      return (
        <KeyE
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "F":
      return (
        <KeyF
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "F#":
      return (
        <KeyFSharp
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "G":
      return (
        <KeyG
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "G#":
      return (
        <KeyGSharp
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "A":
      return (
        <KeyA
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "A#":
      return (
        <KeyASharp
          onClick={onClick}
          note={note}
          octave={octave}
          keyButton={keyButton}
        />
      );
    case "H":
      return (
        <KeyH
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

export default Key;
