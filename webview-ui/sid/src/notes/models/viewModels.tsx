import { INoteSystem } from "./models";

export interface IKeyLabel {
  note: string;
  octave: number;
  keyButton: string;
  onClick: () => any;
}

export interface IKeyNote extends IKeyLabel {
  noMargin?: boolean;
}

export interface INoteView {
  note: string;
  octave: number;
  keyButton: string;
  onClick: () => any;
}

export interface INoteSystemView extends INoteSystem {
  currentSystem: string;
  setCurrentNoteValues: (hi: number, lo: number) => any;
}

export interface ICurrentNote {
  hi: number;
  lo: number;
  dr: number;
}

export interface IDurationView {
  bpm: string;
  defaultBpm: number;
  handleJiffie: (jiffie: number) => any;
}

export interface IDurationRowView {
  dot: number;
  jiffies: number[];
  currentJiffieIdx: number;
  handleJiffie: (jiffie: number, index: number) => any;
}
