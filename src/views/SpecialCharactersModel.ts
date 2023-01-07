import { controlCharsObjects } from '../helpers/controlCharsHelper';
import { SpecialCharacter } from './SpecialCharacter';

export class SpecialCharactersModel {
    constructor() {
    }

    public get roots(): Thenable<SpecialCharacter[]> {
        return Promise.resolve(controlCharsObjects());
    }

    public getChildren(item: SpecialCharacter): Thenable<SpecialCharacter[]> {
        return Promise.resolve([]);
    }

    public get completions(): Thenable<SpecialCharacter[]> {
        return Promise.resolve([]);
    }
}
