import React, { useEffect, useState } from 'react';
import { vscode } from "./utilities/vscode";
import { VSCodeDataGrid, VSCodeDataGridRow, VSCodeDataGridCell, VSCodePanels, VSCodePanelTab, VSCodePanelView } from "@vscode/webview-ui-toolkit/react";

interface ICharObjectItem {
    description: string;
    id: number;
    label: string;
    name: string;
    symbolic: string;
    synonyms: string[];
    unicode: string;
}

interface ICharObject {
    item: ICharObjectItem;
}

interface IMessage {
    command: string;
    text?: string;
    data?: ICharObject[];
}

interface IEvent {
    data?: IMessage;
}

const handlerMessage = (event: IEvent, command: string, callback: (data: ICharObject[] | undefined) => void) => {
    if (event && event.data && event.data.command === command) {
        console.log(event.data);
        callback(event.data.data);
    }
};

const subscribeToMessage = (command: string, callback: (data: ICharObject[] | undefined) => void) => {
    if (window) {
        window.addEventListener(
            "message",
            event => handlerMessage(event, command, callback),
            false
        );
    }
};

function Chars() {

    const [chars, setChars] = useState<ICharObject[] | undefined>([]);

    useEffect(() => {
        subscribeToMessage('getCharsResponse', (data: ICharObject[] | undefined) => setChars(data));
        vscode.postMessage({
            command: "getChars"
        })
    }, []);

    const handleCharacterClick = (snippet: string) => {
        vscode.postMessage({
            command: "text",
            text: snippet,
        });
    }

    return (
        <>
            <p>Click to copy control character</p>
            <VSCodeDataGrid gridTemplateColumns="20px 30px">
                {chars && chars.map((char: ICharObject) => {
                    let label = char.item.symbolic;
                    if (char.item.synonyms.length > 0) {
                        label = `${label} (${char.item.synonyms.join(', ')})`;
                    }
                    return (
                        <VSCodeDataGridRow>
                            <VSCodeDataGridCell grid-column="1" style={{ paddingLeft: 0, cursor: "pointer", font: "normal 13px \"PetMe64\"" }} onClick={() => handleCharacterClick(char.item.symbolic)}>
                                {char.item.unicode}
                            </VSCodeDataGridCell>
                            <VSCodeDataGridCell grid-column="2" style={{ paddingLeft: 0, paddingRight: 0, cursor: "pointer" }} onClick={() => handleCharacterClick(`chr$(${char.item.id})`)}>
                                {char.item.id}
                            </VSCodeDataGridCell>
                            <VSCodeDataGridCell grid-column="3" style={{ paddingLeft: 0, whiteSpace: "nowrap" }}>
                                <div style={{ display: "grid" }}><div> {label}</div><div style={{ fontSize: "10px" }}>{char.item.description}</div></div>
                            </VSCodeDataGridCell>
                        </VSCodeDataGridRow>
                    )
                })}
            </VSCodeDataGrid >
        </>
    );
}

export default Chars;
