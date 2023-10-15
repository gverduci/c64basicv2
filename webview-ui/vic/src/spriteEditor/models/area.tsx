enum AreaMode {
  BW = 1,
  Color,
}

export interface IArea {
  area: number[][];
  numberOfColumns: number;
  numberOfLines: number;
  extendedlines: Generator<[number[], number]>;
  setPixel(line: number, column: number, value: number): any;
  moveToPixel(line: number, column: number): any;
  togglePixel(line: number, column: number): any;
  clear(): void;
  setDataValue(dataString: string): void;
  getDataValue(): string;
}

export interface ISpriteArea extends IArea {
  mode: AreaMode;
}

export class Area implements IArea {
  protected _area: number[][];
  protected _numberOfBytesPerLine: number;
  protected _numberOfLines: number;
  protected currentLine: number;
  protected moveFrom: {line: number, column: number};

  constructor(numberOfBytesPerLine: number, numberOfLines: number) {
    this._area = [];
    this._numberOfBytesPerLine = numberOfBytesPerLine;
    this._numberOfLines = numberOfLines;
    this.currentLine = 0;

    for (let i = 0; i < numberOfLines; i++) {
      this._area[i] = [];
      for (let j = 0; j < numberOfBytesPerLine; j++) {
        this._area[i][j] = 0;
      }
    }
  }

  public clear(): void {
    for (let i = 0; i < this._numberOfLines; i++) {
      this._area[i] = [];
      for (let j = 0; j < this._numberOfBytesPerLine; j++) {
        this._area[i][j] = 0;
      }
    }
  }

  public get numberOfColumns() {
    return this._numberOfBytesPerLine * 8;
  }

  public get numberOfLines() {
    return this._numberOfLines;
  }

  public get area() {
    return this._area;
  }

  public set area(values: number[][]) {
    this._area = values;
  }

  public *columns(count: number): Generator<number> {
    while (count < this._numberOfBytesPerLine) {
      yield this._area[this.currentLine][count++];
    }
  }

  public *linesGenerator(count: number): Generator<number[]> {
    while (count < this._numberOfLines) {
      this.currentLine = count;
      yield this._area[count++];
    }
  }

  public *extendedLinesGenerator(count: number): Generator<[number[], number]> {
    while (count < this._numberOfLines) {
      this.currentLine = count;
      const array = [];
      for (let c = 0; c < this._numberOfBytesPerLine; c++) {
        for (let i = 7; i >= 0; i--) {
          const valueArea = this._area[count][c];
          const value = (valueArea >> i) & 1;
          array.push(value);
        }
      }
      // count++;
      yield [array, count++];
    }
  }

  public get lines() {
    return this.linesGenerator(0);
  }

  public get extendedlines(): Generator<[number[], number]> {
    return this.extendedLinesGenerator(0);
  }

  public checkColumn(column: number) {
    return column < this._numberOfBytesPerLine * 8;
  }
  public checkLine(line: number) {
    return line < this._numberOfLines;
  }

  public getByte(column: number) {
    return Math.floor(column / 8);
  }

  public getBit(column: number) {
    return column % 8;
  }

  public getValue(column: number, line: number) {
    const byte = this.getByte(column);
    const currentValue = this._area[line][byte];
    return currentValue;
  }

  protected getDataValueBase = (
    dataArray: number[][],
    numberOfBytesPerLine: number,
    baseLineNumber: number = 2000,
    maxDataPerLine: number = 8,
  ): string => {
    let count = 0;
    return dataArray.reduce((acc, curr, idx) => {
      let value = "";
      for (let j = 0; j < numberOfBytesPerLine; j++) {
        if (value === "") value = `${curr[j]}`;
        else {
          value = `${value},${curr[j]}`;
        }
      }
      if (idx === 0) {
        acc = `${baseLineNumber + 10 * count++} data ${value}`;
      } else if (idx % maxDataPerLine === 0) {
        acc = `${acc}\n${baseLineNumber + 10 * count++} data ${value}`;
      } else {
        acc = `${acc},${value}`;
      }
      return acc;
    }, "");
  };

  public getDataValue = (baseLineNumber: number = 2000): string => {
    return this.getDataValueBase(
      this._area,
      this._numberOfBytesPerLine,
      baseLineNumber,
    );
  };

  protected getDataFromString = (dataString: string): string[] => {
    const x = dataString?.replaceAll(/\n/gm, ",");
    const x1 = x?.replaceAll(/\s*\d+\s*data/gm, "");
    const x2 = x1?.split(",") || "0";
    return x2;
  };

  protected setDataFromValue = (
    dataArray: string[],
    numOfLines: number,
    numOfBytesPerLine: number,
    startLine: number = 0,
    startColumn: number = 0,
  ) => {
    let counter = 0;
    for (let i = startLine; i < startLine + numOfLines; i++) {
      for (let j = startColumn; j < startColumn + numOfBytesPerLine; j++) {
        const v = dataArray[counter++];
        if (v) {
          this._area[i][j] = parseInt(v);
        } else {
          this._area[i][j] = 0;
        }
      }
    }
  };

  public setDataValue = (dataString: string): void => {
    this.clear();
    const x2 = this.getDataFromString(dataString);
    this.setDataFromValue(x2, this._numberOfLines, this._numberOfBytesPerLine);
  };

  public getPixel(line: number, column: number) {
    if (this.checkColumn(column) && this.checkLine(line)) {
      const bit = this.getBit(column);
      const currentValue = this.getValue(column, line);
      return (currentValue >> (7 - bit)) & 1;
    }
    return null;
  }

  public setPixel(line: number, column: number, value: number) {
    if (this.checkColumn(column) && this.checkLine(line)) {
      const bit = this.getBit(column);
      const currentValue = this.getValue(column, line);
      const mask = value ? 128 >> bit : ~(128 >> bit);
      const newValue = value ? currentValue | mask : currentValue & mask;
      const byte = this.getByte(column);
      this._area[line][byte] = newValue;
      return true;
    }
    return false;
  }

  public moveToPixel(line: number, column: number) {
    if (this.checkColumn(column) && this.checkLine(line)) {
      if (this.moveFrom){
        const deltaLine = line - this.moveFrom.line;
        const deltaColumns = column - this.moveFrom.column;
        this.moveFrom = {line, column};
        const newArea: number[][]=[];
        for (let i = 0; i < this._numberOfLines; i++) {
          newArea[i] = [];
          const currLine = this._area[i - deltaLine];
          let uniqueBitLine = 0;
          if (currLine){
            for (let j = 0; j < this._numberOfBytesPerLine; j++) {
              uniqueBitLine = uniqueBitLine + (currLine[j] << ((this._numberOfBytesPerLine -1 - j) * 8))
            }
            if (deltaColumns > 0){
              uniqueBitLine = uniqueBitLine >> deltaColumns;
            }else if (deltaColumns < 0){
              uniqueBitLine = uniqueBitLine << Math.abs(deltaColumns);
            }
          }
          for (let j = 0; j < this._numberOfBytesPerLine; j++) {
            newArea[i][j] = (uniqueBitLine >> (this._numberOfBytesPerLine - 1 - j) * 8) & 255;
          }
        }
        this._area = newArea;
      } else {
        this.moveFrom = {line, column};
      }
      return true;
    }
    return false;
  }

  public setPixelOn(line: number, column: number) {
    this.setPixel(line, column, 1);
  }

  public setPixelOff(line: number, column: number) {
    this.setPixel(line, column, 0);
  }

  public togglePixel(line: number, column: number) {
    if (this.checkColumn(column) && this.checkLine(line)) {
      const currentValue = this.getPixel(line, column);
      this.setPixel(line, column, currentValue ? 0 : 1);
    }
  }
}

export class CharArea extends Area {
  constructor() {
    super(1, 8);
  }
}

export class MultiCharArea extends Area {
  protected _numberOfColumnChars: number;
  protected _numberOfRowChars: number;
  constructor(numberOfColumnChars: number, numberOfRowChars: number) {
    super(numberOfColumnChars, numberOfRowChars * 8);
    this._numberOfColumnChars = numberOfColumnChars;
    this._numberOfRowChars = numberOfRowChars;
  }

  public setDataValue = (dataString: string): void => {
    this.clear();
    const x2 = this.getDataFromString(dataString);
    for (let row = 0; row < this._numberOfRowChars; row++) {
      for (let col = 0; col < this._numberOfColumnChars; col++) {
        const start = row * this._numberOfColumnChars * 8 + col * 8;
        const startLine = row * 8;
        const startColumn = col * 1;
        const data = x2.slice(start, start + 8);
        if (data.length > 0) {
          this.setDataFromValue(data, 8, 1, startLine, startColumn);
        }
      }
    }
  };

  public getDataValue = (baseLineNumber: number = 2000): string => {
    let count = 0;
    let dataValues = "";
    for (let row = 0; row < this._numberOfRowChars; row++) {
      for (let col = 0; col < this._numberOfColumnChars; col++) {
        const startLine = row * 8;
        const startColumn = col * 1;
        const subArea: number[][] = [];
        for (let i = 0; i < 8; i++) {
          subArea[i] = [];
          subArea[i][0] = this._area[startLine + i][startColumn];
        }
        if (dataValues === "")
          dataValues = this.getDataValueBase(
            subArea,
            1,
            baseLineNumber + 10 * count++,
          );
        else
          dataValues = `${dataValues}\n${this.getDataValueBase(
            subArea,
            1,
            baseLineNumber + 10 * count++,
          )}`;
      }
    }
    return dataValues;
  };
}

export class SpriteArea extends Area implements ISpriteArea {
  private _mode: AreaMode;

  constructor() {
    super(3, 21);
  }

  public get mode() {
    return this._mode;
  }

  public getDataValue = (baseLineNumber: number = 2000): string => {
    return this.getDataValueBase(
      this._area,
      this._numberOfBytesPerLine,
      baseLineNumber,
      3,
    );
  };
}

export class SpriteMulticolorArea extends SpriteArea {

  public get numberOfColumns() {
    return 12;
  }

  public *extendedLinesGenerator(count: number): Generator<[number[], number]> {
    while (count < this._numberOfLines) {
      this.currentLine = count;
      const array = [];
      for (let c = 0; c < this._numberOfBytesPerLine; c++) {
        for (let i = 7; i > 0; i=i-2) {
          const valueArea = this._area[count][c];
          const value1 = (valueArea >> i) & 1;
          const value2 = (valueArea >> i - 1) & 1;
          let newValue = 0;
          if (value1 === 1 && value2 === 1) newValue = 3;
          else if (value1 === 1 && value2 === 0) newValue = 2;
          else if (value1 === 0 && value2 === 1) newValue = 1;
          array.push(newValue);
        }
      }
      // count++;
      yield [array, count++];
    }
  }

  public setPixel(line: number, column: number, value: number) {
    // 0 00 transparent
    // 1 01 color in 53285 (37)
    // 2 11 color in 53286 (38)
    // 3 10 color assegned in 53287(39)-53294
    const newCol = column * 2;
    const newValue1 = value === 3 || value === 2 ? 1 : 0;  
    const newValue2 = value === 2 || value === 1 ? 1 : 0;
    const first = super.setPixel(line, newCol, newValue1);
    const second = super.setPixel(line, newCol + 1, newValue2);
    return first && second;
  }

}
