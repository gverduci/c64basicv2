import {expect} from '@jest/globals';
import { MultiCharArea, SpriteArea } from "../../spriteEditor/models/area";

const printArea = (spriteArea: SpriteArea) =>{
    for (const [index, value] of spriteArea.lines) {
        console.log(index, value);
    }
};

describe('sprite editor - sprite area', () => {
    it('setPixel', () => {
        const spriteArea = new SpriteArea();
        spriteArea.setPixel(0,0,1);
        spriteArea.setPixel(0,1,1);
        spriteArea.setPixel(0,2,1);
        spriteArea.setPixel(0,3,1);
        spriteArea.setPixel(0,4,1);
        spriteArea.setPixel(0,5,1);
        spriteArea.setPixel(0,6,1);
        spriteArea.setPixel(0,7,1);
        spriteArea.setPixel(0,8,1);
        spriteArea.setPixel(0,16,1);
        
        expect(spriteArea.getPixel(0,0)).toBe(1);
        expect(spriteArea.getPixel(0,1)).toBe(1);
        expect(spriteArea.getPixel(0,7)).toBe(1);
        spriteArea.setPixel(0,7,0);
        expect(spriteArea.getPixel(0,7)).toBe(0);
        expect(spriteArea.getPixel(0,8)).toBe(1);
        expect(spriteArea.getPixel(0,16)).toBe(1);
        expect(spriteArea.getPixel(1,0)).toBe(0);

        printArea(spriteArea);
    });
    it('setPixel out', () => {
        const spriteArea = new SpriteArea();
        spriteArea.setPixel(100,100,1);
        expect(spriteArea.getPixel(0,0)).toBe(0);
        expect(spriteArea.getPixel(100,100)).toBe(null);
    });

    it('lines iterator', () => {
        const spriteArea = new SpriteArea();
        spriteArea.setPixel(0,0,1);
        const value = spriteArea.lines.next();
        // let lineCounter = 0;
        // for (const value of spriteArea.lines) {
        //     console.log(lineCounter++, value);
        // }
        expect(value.value[0]).toBe(128);
    });

    it('extended lines iterator', () => {
        const spriteArea = new SpriteArea();
        spriteArea.setPixel(0,0,1);
        const value = spriteArea.extendedlines.next();
        // let lineCounter = 0;
        // for (const value of spriteArea.lines) {  
        //     console.log(lineCounter++, value);
        // }
        expect(value.value[0][0]).toBe(1);
    });

    it('MultiChar', () => {
        const spriteArea = new MultiCharArea(4, 3);
        const sel = "2000 data 0,0,0,1,15,28,8,9\n" + 
            "2010 data 16,48,240,152,248,124,206,135\n" + 
            "2020 data 8,132,70,39,55,55,55,119\n" + 
            "2030 data 0,0,0,192,128,128,192,248\n" + 
            "2040 data 0,0,2,1,5,2,0,0\n" + 
            "2050 data 3,7,15,30,30,190,95,15\n" + 
            "2060 data 175,159,255,96,0,0,0,128\n" + 
            "2070 data 240,240,248,255,48,0,2,194\n" + 
            "2080 data 0,0,4,11,1,2,0,0\n" + 
            "2090 data 23,27,61,224,0,0,12,19\n" + 
            "2100 data 241,255,254,248,225,98,194,161\n" + 
            "2110 data 226,49,25,50,194,9,21,226";
        spriteArea.setDataValue(sel);
        const values = spriteArea.getDataValue();
        expect(values === sel).toBe(true);
    });
});