import { IArea } from "./models/area";

export interface ICommand {
  execute: (spriteArea: IArea) => boolean;
  toSave: (stack: ICommand[]) => ICommand | undefined;
}

export interface IRunner {
  push: (command: ICommand) => void;
  undo: () => void;
  redo: () => void;
}

export class Draw implements ICommand {
  private _event: { line: number; column: number; value: number };

  constructor(event: { line: number; column: number; value: number }) {
    this._event = event;
  }

  execute = (spriteArea: IArea) => {
    spriteArea.setPixel(
      this._event.line,
      this._event.column,
      this._event.value,
    );
    return true;
  };

  toSave = (stack: ICommand[]): ICommand | undefined => {
    return stack
      .filter((x) => {
        return x.constructor === this.constructor;
      })
      .find(
        (x) =>
          x &&
          (x as Draw)._event.line === this._event.line &&
          (x as Draw)._event.column === this._event.column &&
          (x as Draw)._event.value === this._event.value,
      );
  };
}

export class Move implements ICommand {
  private _event: { line: number; column: number };

  constructor(event: { line: number; column: number }) {
    this._event = event;
  }

  execute = (spriteArea: IArea) => {
    spriteArea.moveToPixel(this._event.line, this._event.column);
    return true;
  };

  toSave = (stack: ICommand[]): ICommand | undefined => {
    if (this._event.line === 0 && this._event.column === 0) {
      return undefined;
    }
    return stack
      .filter((x) => {
        return x.constructor === this.constructor;
      })
      .find(
        (x) =>
          x &&
          (x as Move) &&
          (x as Move)._event.line === this._event.line &&
          (x as Move)._event.column === this._event.column,
      );
  };
}

export class ResetMove implements ICommand {
  execute = (spriteArea: IArea) => {
    spriteArea.resetMove();
    return true;
  };

  toSave = (stack: ICommand[]): ICommand | undefined => undefined;
}

export class Clear implements ICommand {
  execute = (spriteArea: IArea) => {
    spriteArea.clear();
    return true;
  };

  toSave = (stack: ICommand[]): ICommand | undefined => undefined;
}

export class Runner implements IRunner {
  private _stack: ICommand[] = [];
  private _stackRedo: ICommand[] = [];
  private _spriteArea: IArea;

  constructor(spriteArea: IArea) {
    this._spriteArea = spriteArea;
  }

  execute = (command: ICommand) => {
    return command.execute(this._spriteArea);
  };

  push = (command: ICommand) => {
    if (!command.toSave(this._stack)) {
      this._stack.push(command);
      if (this._stackRedo.length > 0) {
        this._stackRedo = [];
      }
    }
    return this.execute(command);
  };

  undo = () => {
    const command = this._stack.pop();
    if (command) {
      this._stackRedo.push(command);
      this._spriteArea.clear();
      this._stack.forEach((c) => {
      this.execute(c);
    });
    }
  };

  redo = () => {
    const command = this._stackRedo.pop();
    if (command) {
      this._stack.push(command);
      this._spriteArea.clear();
      this._stack.forEach((c) => {
      this.execute(c);
    });
    }
  };

  reset = () => {
    this._stack = [];
    this._stackRedo = [];
    this._spriteArea.clear();
  };

}

/*
            -> setMode      (evt)
toolbar -----> undo, redo   (evt)
            -> clear        (evt)
            -> setColor     (evt)

            -> init         (evt)
canvas ------> draw         (evt)
            -> delete       (evt)


evt -> run command (update area) -> stack 
                                 -> update view (hook)


*/
