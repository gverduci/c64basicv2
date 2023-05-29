import React, { FC, ReactElement } from 'react';
import { vscode } from "./utilities/vscode";
import { VSCodeDataGrid, VSCodeDataGridRow, VSCodeDataGridCell, VSCodePanels, VSCodePanelTab, VSCodePanelView } from "@vscode/webview-ui-toolkit/react";
import Title from "webview-common/build/Title"
import Subtitle from "webview-common/build/Subtitle"

interface IbitObj {
    name: string,
    value: string | number
};

interface IbitValue {
    bit: string,
    names: IbitObj[]
};

interface IRegister {
    addr: number,
    bits: IbitValue[],
    rw: string
};

interface IRegisterProps {
    registers: IRegister[],
    handleAddressClick: (snippet: string) => void
    handleAddressAndValueClick: (snippet: string) => void
}

interface IRegisterVoiceProps extends IRegisterProps {
    voiceNumber: number
}

const voice = [
    { addr: 0, bits: [{ bit: "7..0", names: [{ name: "Frequency low byte", value: "" }] }], rw: "w" },
    { addr: 1, bits: [{ bit: "7..0", names: [{ name: "Frequency high byte", value: "" }] }], rw: "w" },
    { addr: 2, bits: [{ bit: "7..0", names: [{ name: "Pulse wave duty cycle low byte", value: "" }] }], rw: "w" },
    { addr: 3, bits: [{ bit: "7..4", names: [{ name: "-", value: "" }] }, { bit: "3..0", names: [{ name: "Pulse wave duty cycle high byte", value: "" }] }], rw: "w" },
    { addr: 4, bits: [{ bit: "7", names: [{ name: "Noise", value: 128 }, { name: "(Noise + Gate)", value: 129 }] }, { bit: "6", names: [{ name: "Square", value: 64 }, { name: "(Square + Gate)", value: 65 }] }, { bit: "5", names: [{ name: "STooth", value: 32 }, { name: "(STooth+ Gate)", value: 33 }] }, { bit: "4", names: [{ name: "Triang", value: 16 }, { name: "(Triang + Gate)", value: 17 }] }, { bit: "3", names: [{ name: "Test", value: 8 }] }, { bit: "2", names: [{ name: "Ring", value: 4 }] }, { bit: "1", names: [{ name: "Sync", value: 2 }] }, { bit: "0", names: [{ name: "Gate", value: 1 }] }], rw: "w" },
    { addr: 5, bits: [{ bit: "7..4", names: [{ name: "Attack duration", value: "" }] }, { bit: "3..0", names: [{ name: "Decay duration", value: "" }] }], rw: "w" },
    { addr: 6, bits: [{ bit: "7..4", names: [{ name: "Sustain level", value: "" }] }, { bit: "3..0", names: [{ name: "Release duration", value: "" }] }], rw: "w" },
];

const filter = [
    { addr: 21, bits: [{ bit: "7..4", names: [{ name: "-", value: "" }] }, { bit: "3..0", names: [{ name: "FC.lo", value: "" }] }], rw: "w" },
    { addr: 22, bits: [{ bit: "7..0", names: [{ name: "FC.hi", value: "" }] }], rw: "w" },
    { addr: 23, bits: [{ bit: "7..4", names: [{ name: "Res", value: "" }] }, { bit: "3", names: [{ name: "Fx", value: 8 }] }, { bit: "2..0", names: [{ name: "Filt", value: "" }] }], rw: "w" },
    { addr: 24, bits: [{ bit: "7", names: [{ name: "3OFF", value: 128 }] }, { bit: "6", names: [{ name: "H", value: 64 }] }, { bit: "5", names: [{ name: "B", value: 32 }] }, { bit: "4", names: [{ name: "L", value: 16 }] }, { bit: "3..0", names: [{ name: "Volume", value: "" }, { name: "(max)", value: 15 }, { name: "(min)", value: 0 }] }], rw: "w" },
];

const misc = [
    { addr: 25, bits: [{ bit: "7..0", names: [{ name: "POTX", value: "" }] }], rw: "r" },
    { addr: 26, bits: [{ bit: "7..0", names: [{ name: "POTY", value: "" }] }], rw: "r" },
    { addr: 27, bits: [{ bit: "7..0", names: [{ name: "Osc", value: "" }] }], rw: "r" },
    { addr: 28, bits: [{ bit: "7..0", names: [{ name: "Env", value: "" }] }], rw: "r" },
];

const TabVoiceGrid: FC<IRegisterVoiceProps> = ({ registers, voiceNumber, handleAddressClick, handleAddressAndValueClick }): ReactElement =>
(<VSCodeDataGrid gridTemplateColumns="60px 280px">
    <VSCodeDataGridRow row-type="header">
        <VSCodeDataGridCell cell-type="columnheader" grid-column="1">reg.</VSCodeDataGridCell>
        <VSCodeDataGridCell cell-type="columnheader" grid-column="2">bits</VSCodeDataGridCell>
    </VSCodeDataGridRow>
    {registers.map(row => {
        let address = row.addr;
        if (voiceNumber)
            address = address + (voiceNumber - 1) * 7
        return (
            <VSCodeDataGridRow>
                <VSCodeDataGridCell cell-type="columnheader" grid-column="1" style={{ cursor: "pointer", color: "var(--button-primary-background)"}} className="clickable" onClick={() => handleAddressClick(`poke s+${address},`)}>{`s+${address}`}</VSCodeDataGridCell>
                <VSCodeDataGridCell grid-column="2">
                    {row.bits.map((b, index) => (
                        <div style={{ display: "table" }}>
                            <div style={{ display: "table-cell", minWidth: "30px" }}>{b.bit}</div>
                            {b.names.map((n, index) => {
                                if (n.value !== "")
                                    return (<div style={{ display: "table-cell", paddingRight: "8px", cursor: "pointer", color: "var(--button-primary-background)" }} onClick={() => handleAddressAndValueClick(`poke s+${address},${n.value}`)}>{n.name}</div>)
                                return (<div style={{ display: "table-cell", paddingRight: "8px" }}>{n.name}</div>)
                            })}
                        </div>
                    ))}
                </VSCodeDataGridCell>
            </VSCodeDataGridRow>
        )
    })}
</VSCodeDataGrid>)


const TabGrid: FC<IRegisterProps> = ({ registers, handleAddressClick, handleAddressAndValueClick }): ReactElement =>
(<TabVoiceGrid registers={registers} voiceNumber={0} handleAddressClick={handleAddressClick} handleAddressAndValueClick={handleAddressAndValueClick} />)


function SidAddresses() {
    const handleAddressAndValueClick = (snippet: string) => {
        vscode.postMessage({
            command: "text",
            text: snippet,
        });
    }
    const handleAddressClick = (snippet: string) => {
        vscode.postMessage({
            command: "snippet",
            text: snippet,
        });
    }
    const handleAddressBaseClick = (address: string) => {
        vscode.postMessage({
            command: "text",
            text: address,
        });
    }

    return (
        <>
            <Title text="Sid Addresses">
                <span style={{ margin: 0, cursor: "pointer" }} onClick={() => handleAddressBaseClick("s=54272")}>(s=54272)</span>
            </Title>
            <Subtitle text="click on registry, or on bits, to copy the corresponding poke command" />
            <VSCodePanels>
                <VSCodePanelTab id="tab-1">Voice 1</VSCodePanelTab>
                <VSCodePanelTab id="tab-2">Voice 2</VSCodePanelTab>
                <VSCodePanelTab id="tab-3">Voice 3</VSCodePanelTab>
                <VSCodePanelTab id="tab-4">Filter</VSCodePanelTab>
                <VSCodePanelTab id="tab-5">Misc</VSCodePanelTab>
                <VSCodePanelView id="view-1">
                    <TabVoiceGrid registers={voice} voiceNumber={1} handleAddressClick={handleAddressClick} handleAddressAndValueClick={handleAddressAndValueClick} />
                </VSCodePanelView>
                <VSCodePanelView id="view-2">
                    <TabVoiceGrid registers={voice} voiceNumber={2} handleAddressClick={handleAddressClick} handleAddressAndValueClick={handleAddressAndValueClick} />
                </VSCodePanelView>
                <VSCodePanelView id="view-3">
                    <TabVoiceGrid registers={voice} voiceNumber={3} handleAddressClick={handleAddressClick} handleAddressAndValueClick={handleAddressAndValueClick} />
                </VSCodePanelView>
                <VSCodePanelView id="view-4">
                    <TabGrid registers={filter} handleAddressClick={handleAddressClick} handleAddressAndValueClick={handleAddressAndValueClick} />
                </VSCodePanelView>
                <VSCodePanelView id="view-5">
                    <TabGrid registers={misc} handleAddressClick={handleAddressClick} handleAddressAndValueClick={handleAddressAndValueClick} />
                </VSCodePanelView>
            </VSCodePanels>
        </>
    );
}

export default SidAddresses;
