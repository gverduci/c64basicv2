import { ISpecialCharacter } from './ISpecialCharacter';

export class SpecialCharacter {

    constructor(private item: ISpecialCharacter) {
    }

    public get id(): number {
        return this.item.id;
    }

    public get name(): string {
        return this.item.name;
    }

    public get label(): string {
        return this.item.label;
    }

    public get description(): string {
        return this.item.description;
    }

    public get symbolic(): string {
        return this.item.symbolic;
    }

    public get unicode(): string {
        return this.item.unicode;
    }

    public get synonyms(): string[] {
        return this.item.synonyms;
    }
}
