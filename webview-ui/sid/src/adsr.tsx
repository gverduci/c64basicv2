import React, { useState, useEffect } from 'react';
import { vscode } from "./utilities/vscode";
import { VSCodeButton, VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import { useRef } from 'react';
import Title from './common/Title';

function ADSR() {
    const [attack, setAttack] = useState<number>(0.500);
    const [attackSelected, setAttackSelected] = useState<string>("10");
    const [decay, setDecay] = useState<number>(0.750);
    const [decaySelected, setDecaySelected] = useState<string>("9");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [sustain, setSustain] = useState<number>(3);
    const [sustainLevel, setSustainLevel] = useState<number>(7);
    const [sustainLevelSelected, setSustainLevelSelected] = useState<string>("7");
    const [release, setRelease] = useState<number>(1.500);
    const [releaseSelected, setReleaseSelected] = useState<string>("10");
    const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>();
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);
    const canvasRef = useRef<null | HTMLCanvasElement>(null)
    useEffect(() => {
        if (canvasRef && canvasRef.current) {
            setCanvasContext(canvasRef.current.getContext("2d"));
            setCanvasWidth(canvasRef.current.width);
            setCanvasHeight(canvasRef.current.height);
        }
    }, [canvasRef]);

    useEffect(() => {
        /**
         * 
         * @param {number} attack 2ms - 8s
         * @param {*} decay 6ms - 24 s
         * @param {*} sustainLevel 0 - 15
         * @param {*} release 6ms - 24 s
         * @param {*} sustain s
         */
        const drawADSR = (attack: number, decay: number, sustainLevel: number, release: number, sustain: number) => {
            const headlen = 6; // length of head in pixels
            const bottomAreaGate = 30;
            const bottomArea = bottomAreaGate;
            const preGatePostRelease = 0.5; //s
            const maxs = preGatePostRelease + attack + decay + sustain + release + preGatePostRelease;
            const startx = 30;
            const maxWidth = canvasWidth;
            const maxx = maxWidth - startx;

            const margin = ((preGatePostRelease / maxs) * maxx);
            const basex = margin + startx;
            const bottomy = canvasHeight - bottomArea - headlen;
            const peaky = 10;
            // a:maxs=x:maxx
            const attackp = basex + ((attack / maxs) * maxx);
            const decayp = attackp + ((decay / maxs) * maxx);
            const sustainx = decayp + ((sustain / maxs) * maxx);
            const sustainy = bottomy - ((bottomy - peaky) / 15) * sustainLevel;
            const releasex = sustainx + ((release / maxs) * maxx);

            if (canvasContext) {
                var ctx: CanvasRenderingContext2D = canvasContext;
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);

                // start zero line
                ctx.strokeStyle = '#569cd6';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(startx, bottomy);
                ctx.lineTo(basex, bottomy);
                ctx.stroke();

                // attack line
                ctx.beginPath();
                ctx.moveTo(basex, bottomy);
                ctx.lineTo(attackp, peaky);
                ctx.stroke();

                // decay line
                ctx.beginPath();
                ctx.moveTo(attackp, peaky);
                ctx.lineTo(decayp, sustainy);
                ctx.stroke();

                // sustain line
                ctx.beginPath();
                ctx.moveTo(decayp, sustainy);
                ctx.lineTo(sustainx, sustainy);
                ctx.stroke();

                // release line
                ctx.beginPath();
                ctx.moveTo(sustainx, sustainy);
                ctx.quadraticCurveTo(sustainx + (releasex - sustainx) / 12, bottomy + (bottomy - sustainy) / 12, releasex, bottomy);
                ctx.stroke();

                // end zero line
                ctx.beginPath();
                ctx.moveTo(releasex, bottomy);
                ctx.lineTo(maxWidth, bottomy);
                ctx.stroke();

                // bottom part

                ctx.lineWidth = .5;
                ctx.font = "lighter 10px monospace";

                // time axis
                ctx.beginPath();
                ctx.moveTo(startx - 2 * headlen, bottomy);
                ctx.lineTo(maxWidth, bottomy);
                ctx.stroke();

                // attack
                ctx.beginPath();
                ctx.moveTo(basex, bottomy - headlen);
                ctx.lineTo(basex, bottomy + headlen);
                ctx.stroke();
                ctx.strokeText("A", (attackp - (attackp - basex) / 2) - headlen, bottomy + 2 * headlen);

                // decay
                ctx.beginPath();
                ctx.moveTo(attackp, bottomy - headlen);
                ctx.lineTo(attackp, bottomy + headlen);
                ctx.stroke();
                ctx.strokeText("D", (decayp - (decayp - attackp) / 2) - headlen, bottomy + 2 * headlen);

                // sustain
                ctx.beginPath();
                ctx.moveTo(decayp, bottomy - headlen);
                ctx.lineTo(decayp, bottomy + headlen);
                ctx.stroke();
                ctx.strokeText("S", (sustainx - (sustainx - decayp) / 2) - headlen, bottomy + 2 * headlen);

                // release
                ctx.beginPath();
                ctx.moveTo(sustainx, bottomy - headlen);
                ctx.lineTo(sustainx, bottomy + headlen);
                ctx.moveTo(releasex, bottomy - headlen);
                ctx.lineTo(releasex, bottomy + headlen);
                ctx.stroke();
                ctx.strokeText("R", (releasex - (releasex - sustainx) / 2) - headlen, bottomy + 2 * headlen);

                // last part
                ctx.beginPath();
                ctx.moveTo(releasex, bottomy - headlen);
                ctx.moveTo(releasex, bottomy + headlen);
                ctx.stroke();
                ctx.strokeText("time", releasex + 2, bottomy + 2 * headlen);

                // gate
                ctx.beginPath();
                ctx.moveTo(basex, bottomy + bottomAreaGate - 2 * headlen);
                ctx.lineTo(basex, bottomy + bottomAreaGate);
                ctx.moveTo(basex, bottomy + bottomAreaGate - headlen);
                ctx.lineTo(sustainx, bottomy + bottomAreaGate - headlen);
                ctx.moveTo(sustainx, bottomy + bottomAreaGate - 2 * headlen);
                ctx.lineTo(sustainx, bottomy + bottomAreaGate);
                ctx.stroke();
                ctx.strokeText("Gate", (sustainx - (sustainx - basex) / 2) - headlen, bottomy + bottomAreaGate + 1 * headlen);
                
                // amplitude axis
                ctx.beginPath();
                ctx.moveTo(startx, 0);
                ctx.lineTo(startx, bottomy + 2 * headlen);
                ctx.stroke();

                ctx.beginPath();
                if (sustainy !== peaky){
                    // peek
                    ctx.moveTo(startx - headlen, peaky);
                    ctx.lineTo(startx + headlen, peaky);
                }
                if (sustainy !== bottomy){
                    // Sl
                    ctx.moveTo(startx - headlen, sustainy);
                    ctx.lineTo(startx + headlen, sustainy);
                    ctx.stroke();
                }
                if (sustainy !== peaky){
                    ctx.strokeText("Peak", startx + headlen, (peaky - headlen / 2) + headlen);
                }
                ctx.translate(startx - 2 * headlen, ((bottomy - peaky) / 2) + headlen - 35);
                ctx.rotate(-Math.PI / 2);
                ctx.translate(-startx + 2 * headlen, -((bottomy - peaky) / 2) - headlen + 35);
                ctx.strokeText("amplitude", startx - 2 * headlen, ((bottomy - peaky) / 2) + headlen - 35);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                if (sustainy !== bottomy){
                    ctx.strokeText("Sl", startx + headlen, (sustainy - headlen / 2) + headlen);
                }
                ctx.stroke();
            }
        };
        if (canvasContext)
            drawADSR(attack, decay, sustainLevel, release, sustain);
    }, [attack, decay, sustainLevel, release, sustain, canvasContext, canvasHeight, canvasWidth]);

    const attackValues = [
        { value: "0", dataValue: 0.002, label: "0 (0000) - A: 2ms" },
        { value: "1", dataValue: 0.008, label: "1 (0001) - A: 8ms" },
        { value: "2", dataValue: 0.016, label: "2 (0010) - A: 16ms" },
        { value: "3", dataValue: 0.024, label: "3 (0011) - A: 24ms" },
        { value: "4", dataValue: 0.038, label: "4 (0100) - A: 38ms" },
        { value: "5", dataValue: 0.056, label: "5 (0101) - A: 56ms" },
        { value: "6", dataValue: 0.068, label: "6 (0110) - A: 68ms" },
        { value: "7", dataValue: 0.080, label: "7 (0111) - A: 80ms" },
        { value: "8", dataValue: 0.100, label: "8 (1000) - A: 100ms" },
        { value: "9", dataValue: 0.250, label: "9 (1001) - A: 250ms" },
        { value: "10", dataValue: 0.500, label: "10 (1010) - A: 0.5s" },
        { value: "11", dataValue: 0.800, label: "11 (1011) - A: 0.8s" },
        { value: "12", dataValue: 1.000, label: "12 (1100) - A: 1s" },
        { value: "13", dataValue: 3.000, label: "13 (1101) - A: 3s" },
        { value: "14", dataValue: 5.000, label: "14 (1110) - A: 5s" },
        { value: "15", dataValue: 8.000, label: "15 (1111) - A: 8s" },
    ];
    const handleAttackChange = (evt: Event | React.FormEvent<HTMLElement>) => {
        const element = evt.target as HTMLInputElement
        setAttackSelected(element.value);
        setAttack(attackValues.find(r => r.value === element.value)?.dataValue || 0)
    }

    const decayValues = [
        { value: "0", dataValue: 0.006, label: "0 (0000) - D: 6ms" },
        { value: "1", dataValue: 0.024, label: "1 (0001) - D: 24ms" },
        { value: "2", dataValue: 0.048, label: "2 (0010) - D: 48ms" },
        { value: "3", dataValue: 0.072, label: "3 (0011) - D: 72ms" },
        { value: "4", dataValue: 0.114, label: "4 (0100) - D: 114ms" },
        { value: "5", dataValue: 0.168, label: "5 (0101) - D: 168ms" },
        { value: "6", dataValue: 0.204, label: "6 (0110) - D: 204ms" },
        { value: "7", dataValue: 0.240, label: "7 (0111) - D: 240ms" },
        { value: "8", dataValue: 0.300, label: "8 (1000) - D: 300ms" },
        { value: "9", dataValue: 0.750, label: "9 (1001) - D: 750ms" },
        { value: "10", dataValue: 1.500, label: "10 (1010) - D: 1.5s" },
        { value: "11", dataValue: 2.400, label: "11 (1011) - D: 2.4s" },
        { value: "12", dataValue: 3.000, label: "12 (1100) - D: 3.0s" },
        { value: "13", dataValue: 9.000, label: "13 (1101) - D: 9.0s" },
        { value: "14", dataValue: 15.00, label: "14 (1110) - D: 15.0s" },
        { value: "15", dataValue: 24.00, label: "15 (1111) - D: 24.0s" },
    ];
    const handleDecayChange = (evt: Event | React.FormEvent<HTMLElement>) => {
        const element = evt.target as HTMLInputElement
        setDecaySelected(element.value);
        setDecay(decayValues.find(r => r.value === element.value)?.dataValue || 0)
    }

    const sustainLevelValues = [
        { value: "0", dataValue: 0, label: "0 (0000) - S: 0" },
        { value: "1", dataValue: 1, label: "1 (0001) - S: 1" },
        { value: "2", dataValue: 2, label: "2 (0010) - S: 2" },
        { value: "3", dataValue: 3, label: "3 (0011) - S: 3" },
        { value: "4", dataValue: 4, label: "4 (0100) - S: 4" },
        { value: "5", dataValue: 5, label: "5 (0101) - S: 5" },
        { value: "6", dataValue: 6, label: "6 (0110) - S: 6" },
        { value: "7", dataValue: 7, label: "7 (0111) - S: 7" },
        { value: "8", dataValue: 8, label: "8 (1000) - S: 8" },
        { value: "9", dataValue: 9, label: "9 (1001) - S: 9" },
        { value: "10", dataValue: 10, label: "10 (1010) - S: 10" },
        { value: "11", dataValue: 11, label: "11 (1011) - S: 11" },
        { value: "12", dataValue: 12, label: "12 (1100) - S: 12" },
        { value: "13", dataValue: 13, label: "13 (1101) - S: 13" },
        { value: "14", dataValue: 14, label: "14 (1110) - S: 14" },
        { value: "15", dataValue: 15, label: "15 (1111) - S: 15" },
    ];

    const handleSustainChange = (evt: Event | React.FormEvent<HTMLElement>) => {
        const element = evt.target as HTMLInputElement;
        setSustainLevelSelected(element.value);
        setSustainLevel(sustainLevelValues.find(r => r.value === element.value)?.dataValue || 0)
    }

    const releaseValues = [
        { value: "0", dataValue: 0.006, label: "0 (0000) - R: 6ms" },
        { value: "1", dataValue: 0.024, label: "1 (0001) - R: 24ms" },
        { value: "2", dataValue: 0.048, label: "2 (0010) - R: 48ms" },
        { value: "3", dataValue: 0.072, label: "3 (0011) - R: 72ms" },
        { value: "4", dataValue: 0.114, label: "4 (0100) - R: 114ms" },
        { value: "5", dataValue: 0.168, label: "5 (0101) - R: 168ms" },
        { value: "6", dataValue: 0.204, label: "6 (0110) - R: 204ms" },
        { value: "7", dataValue: 0.240, label: "7 (0111) - R: 240ms" },
        { value: "8", dataValue: 0.300, label: "8 (1000) - R: 300ms" },
        { value: "9", dataValue: 0.750, label: "9 (1001) - R: 750ms" },
        { value: "10", dataValue: 1.500, label: "10 (1010) - R: 1.5s" },
        { value: "11", dataValue: 2.400, label: "11 (1011) - R: 2.4s" },
        { value: "12", dataValue: 3.000, label: "12 (1100) - R: 3.0s" },
        { value: "13", dataValue: 9.000, label: "13 (1101) - R: 9.0s" },
        { value: "14", dataValue: 15.00, label: "14 (1110) - R: 15.0s" },
        { value: "15", dataValue: 24.00, label: "15 (1111) - R: 24.0s" },
    ];

    const handleReleaseChange = (evt: Event | React.FormEvent<HTMLElement>) => {
        const element = evt.target as HTMLInputElement;
        setReleaseSelected(element.value);
        setRelease(releaseValues.find(r => r.value === element.value)?.dataValue || 0)
    }
    const handleADClick = () => {
        const valHi = parseInt(attackSelected, 10);
        const valHiSh = valHi << 4;
        const valLow = parseInt(decaySelected, 10);
        const val = valHiSh + valLow;
        vscode.postMessage({
            command: "text",
            text: `${val}`,
        });
    }
    const handleSRClick = () => {
        const valHi = parseInt(sustainLevelSelected, 10);
        const valHiSh = valHi << 4;
        const valLow = parseInt(releaseSelected, 10);
        const val = valHiSh + valLow;
        vscode.postMessage({
            command: "text",
            text: `${val}`,
        });
    }
    return (
        <>
            <Title text="Attack (A)-Decay (D) / Sustain (S)-Release (R)" />
            <canvas ref={canvasRef} width="425" height="220"></canvas>
            <div style={{ display: "grid", gridTemplateColumns: "auto auto auto" }}>
                <div style={{ display: "grid" }}>
                    <label htmlFor="attack">Attack time (A)</label>
                    <VSCodeDropdown id="attack" onChange={(e) => { handleAttackChange(e); }} value={attackSelected} style={{ height: "28px", width: "150px" }}>
                        {
                            attackValues.map(r => (<VSCodeOption key={`d${r.value}`} value={`${r.value}`}>{r.label}</VSCodeOption>))
                        }
                    </VSCodeDropdown>
                </div>
                <div style={{ marginLeft: "16px", display: "grid" }}>
                    <label htmlFor="decay">Decay time (D)</label>
                    <VSCodeDropdown onChange={(e) => { handleDecayChange(e); }} value={decaySelected} style={{ height: "28px", width: "150px" }}>
                        {
                            decayValues.map(r => (<VSCodeOption key={`d${r.value}`} value={`${r.value}`}>{r.label}</VSCodeOption>))
                        }
                    </VSCodeDropdown>
                </div>
                <div style={{ marginLeft: "16px", display: "grid" }}>
                    <label htmlFor="ADButton">&nbsp;</label>
                    <VSCodeButton id="ADButton" onClick={handleADClick}>&gt;</VSCodeButton>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "auto auto auto" }}>
                <div style={{ display: "grid" }}>
                    <label htmlFor="decay">Sustain level (Sl)</label>
                    <VSCodeDropdown onChange={(e) => { handleSustainChange(e); }} value={sustainLevelSelected} style={{ height: "28px", width: "150px" }}>
                        {
                            sustainLevelValues.map(r => (<VSCodeOption key={`s${r.value}`} value={`${r.value}`}>{r.label}</VSCodeOption>))
                        }
                    </VSCodeDropdown>
                </div>
                <div style={{ marginLeft: "16px", display: "grid" }}>
                    <label htmlFor="decay">Release time (R)</label>
                    <VSCodeDropdown onChange={(e) => { handleReleaseChange(e); }} value={releaseSelected} style={{ height: "28px", width: "150px" }} >
                        {
                            releaseValues.map(r => (<VSCodeOption key={`r${r.value}`} value={`${r.value}`}>{r.label}</VSCodeOption>))
                        }
                    </VSCodeDropdown>
                </div>
                <div style={{ marginLeft: "16px", display: "grid" }}>
                    <label htmlFor="SRButton">&nbsp;</label>
                    <VSCodeButton id="SRButton" onClick={handleSRClick}>&gt;</VSCodeButton>
                </div>
            </div>
        </>
    );
}


/**
 * https://archive.org/details/The_Commodore_64_Music_Book/page/n49/mode/2up
 * https://archive.org/details/Compute_s_All_About_the_Commodore_64_Volume_Two/page/284/mode/2up
 *                  A   D   S   R
 * banjo effect     0   7   0   5           POKE 54277,7 : POKE 54278,5
 * organ            2   0   15  5   4
 */

export default ADSR;
