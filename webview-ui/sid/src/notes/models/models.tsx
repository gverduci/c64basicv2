export interface INoteValue {
    octave: number,
    dec: number,
    hi: number,
    lo: number
};

export interface INote {
    note: string,
    synonym: string,
    values: INoteValue[]
};

export interface INoteSystem {
    system: string,
    info: string,
    notes: INote[]
};
