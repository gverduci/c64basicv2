import React, { useState, useEffect } from "react";
import { vscode } from "../utilities/vscode";
import "../../node_modules/@vscode/codicons/dist/codicon.css";
import "../../node_modules/@vscode/codicons/dist/codicon.ttf";
import {
  VSCodeButton,
  VSCodeDataGrid,
  VSCodeDataGridCell,
  VSCodeDataGridRow,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import Title from "webview-common/build/Title";
import Subtitle from "webview-common/build/Subtitle";
import {
  CharArea,
  IArea,
  MultiCharArea,
  SpriteArea,
  SpriteMulticolorArea,
} from "./models/area";
import StepperSection from "webview-common/build/StepperSection";
import useDrawCanvas from "./useDrawCanvas";
import Toolbar from "./toolbar";

import { Draw, Move, Clear, Runner, ResetMove } from "./commandDrawCanvas";

let spriteArea: IArea = new SpriteArea();
let runner = new Runner(spriteArea);

interface IMessage {
  command: string;
  text?: string;
  data?: string;
}

interface IEvent {
  data?: IMessage;
}

const handlerMessage = (
  event: IEvent,
  command: string,
  callback: (data: string | undefined) => void,
) => {
  if (event && event.data && event.data.command === command) {
    console.log(event.data);
    callback(event.data.data);
  }
};

const subscribeToMessage = (
  command: string,
  callback: (data: string | undefined) => void,
) => {
  if (window) {
    window.addEventListener(
      "message",
      (event) => handlerMessage(event, command, callback),
      false,
    );
  }
};

function SpriteEditor() {
  const [type, setType] = useState("Sprite");
  const [multiCharsRows, setMultiCharsRows] = useState(4);
  const [multiCharsCols, setMultiCharsCols] = useState(3);
  const [pixelColor, setPixelColor] = useState<number>(1);

  const {
    canvasRef,
    update,
    pixelWidth,
    pixelHeight,
    colorMap,
    statusCurrentAction,
    modes,
    mode,
    setMode,
    // undo,
    // redo
  } = useDrawCanvas(
    spriteArea.numberOfColumns,
    spriteArea.numberOfLines,
    spriteArea.extendedlines,
  );

  useEffect(() => {
    if (statusCurrentAction && statusCurrentAction.action === "DRAW" && statusCurrentAction.status === "on") {
      let newValue = statusCurrentAction.value;
      if (type === "SpriteMulticolor") {
        console.log(`${newValue} ---> ${pixelColor}`);
        newValue = newValue ? pixelColor : 0;
      }
      // spriteArea.setPixel(newEventSetPixel.line, newEventSetPixel.column, newValue);
      const command = new Draw({
        line: statusCurrentAction.line,
        column: statusCurrentAction.column,
        value: newValue
      });
      runner.push(command);
    }
    if (statusCurrentAction && statusCurrentAction.action === "MOVE" && statusCurrentAction.status === "on") {
      const command = new Move({
        line: statusCurrentAction.line,
        column: statusCurrentAction.column
      });
      runner.push(command);
    }
    if (statusCurrentAction && statusCurrentAction.action === "MOVE" && statusCurrentAction.status === "off") {
      const command = new ResetMove();
      runner.push(command);
    }
  }, [statusCurrentAction, type, pixelColor]);

  useEffect(() => {
    setPixelColor(1);
    if (type === "Sprite") {
      spriteArea = new SpriteArea();
      update();
    } else if (type === "SpriteMulticolor") {
      spriteArea = new SpriteMulticolorArea();
      update();
    } else if (type === "Char") {
      spriteArea = new CharArea();
      update();
    } else if (type === "MultiChar") {
      spriteArea = new MultiCharArea(multiCharsRows || 4, multiCharsCols || 3);
      update();
    }
    runner = new Runner(spriteArea);
  }, [type, multiCharsCols, multiCharsRows, update]);

  const handleAdd = () => {
    const value = spriteArea.getDataValue();
    vscode.postMessage({
      command: "text",
      text: value,
    });
  };

  const handleGet = () => {
    subscribeToMessage("getSelectionResponse", (data: string | undefined) => {
      runner.reset();
      spriteArea.setDataValue(data ? data : "");
      update();
    });
    vscode.postMessage({
      command: "getSelection",
    });
  };

  const handleClr = () => {
    const command = new Clear();
    runner.push(command);
    update();
  };

  const handleUndo = () => {
    runner.undo();
    update();
  };

  const handleRedo = () => {
    runner.redo();
    update();
  };

  const handleType = (evt: Event | React.FormEvent<HTMLElement>) => {
    const element = evt.target as HTMLInputElement;
    setType(element.value);
  };

  const handleMultiCharsRows = (evt: Event | React.FormEvent<HTMLElement>) => {
    const element = evt.target as HTMLInputElement;
    const value = parseInt(element.value);
    setMultiCharsRows(value > 1 && value < 9 ? value : 4);
  };

  const handleMultiCharsCols = (evt: Event | React.FormEvent<HTMLElement>) => {
    const element = evt.target as HTMLInputElement;
    const value = parseInt(element.value);
    setMultiCharsCols(value > 1 && value < 9 ? value : 3);
  };

  const handleColor = (evt: Event | React.FormEvent<HTMLElement>) => {
    const element = evt.target as HTMLInputElement;
    const value = parseInt(element.value);
    setPixelColor(value);
  };

  return (
    <>
      <Title text="Sprite editor" />
      <Subtitle text="follow these steps to generate a sprite" />
      <StepperSection title="Type" subtitle="select a type" description="">
        <VSCodeDataGrid gridTemplateColumns="200px 200px">
          <VSCodeDataGridRow row-type="header">
            <VSCodeDataGridCell grid-column="1">
              <VSCodeDropdown
                id="type"
                onChange={(e) => {
                  handleType(e);
                }}
                value={`${type}`}
                style={{ height: "28px", width: "200px" }}
              >
                <VSCodeOption key="Sprite" value="Sprite">
                  Sprite
                </VSCodeOption>
                <VSCodeOption key="SpriteMulticolor" value="SpriteMulticolor">
                  Sprite Multicolor
                </VSCodeOption>
                <VSCodeOption key="Char" value="Char">
                  Char
                </VSCodeOption>
                <VSCodeOption key="MultiChar" value="MultiChar">
                  MultiChar
                </VSCodeOption>
              </VSCodeDropdown>
            </VSCodeDataGridCell>
            <VSCodeDataGridCell grid-column="2"></VSCodeDataGridCell>
          </VSCodeDataGridRow>
          {type === "MultiChar" && (
            <VSCodeDataGridRow>
              <VSCodeDataGridCell grid-column="1">
                <p>Rows (# of character)</p>
                <VSCodeTextField
                  size={1}
                  maxlength={1}
                  value={`${multiCharsRows}`}
                  onChange={(evt) => handleMultiCharsRows(evt)}
                />
              </VSCodeDataGridCell>
              <VSCodeDataGridCell grid-column="2">
                <p>Columns (# of character)</p>
                <VSCodeTextField
                  size={1}
                  maxlength={1}
                  value={`${multiCharsCols}`}
                  onChange={(evt) => handleMultiCharsCols(evt)}
                />
              </VSCodeDataGridCell>
            </VSCodeDataGridRow>
          )}
          {type === "SpriteMulticolor" && (
            <VSCodeDataGridRow row-type="header">
              <VSCodeDataGridCell grid-column="1">
                <VSCodeDropdown
                  id="type"
                  onChange={(e) => {
                    handleColor(e);
                  }}
                  value={`${pixelColor}`}
                  style={{ height: "28px", width: "200px" }}
                >
                  <VSCodeOption key="1" value="1">
                    Multicolor 0 (s+37)
                    <span
                      slot="start"
                      className="codicon codicon-circle-large-filled"
                      style={{ color: colorMap[1] }}
                    ></span>
                  </VSCodeOption>
                  <VSCodeOption key="2" value="2">
                    Multicolor 1 (s+38)
                    <span
                      slot="start"
                      className="codicon codicon-circle-large-filled"
                      style={{ color: colorMap[2] }}
                    ></span>
                  </VSCodeOption>
                  <VSCodeOption key="3" value="3">
                    Color Sprite (s+39 - s+46)
                    <span
                      slot="start"
                      className="codicon codicon-circle-large-filled"
                      style={{ color: colorMap[3] }}
                    ></span>
                  </VSCodeOption>
                </VSCodeDropdown>
              </VSCodeDataGridCell>
              <VSCodeDataGridCell grid-column="2"></VSCodeDataGridCell>
            </VSCodeDataGridRow>
          )}
        </VSCodeDataGrid>
      </StepperSection>
      <StepperSection
        title="Sprite"
        subtitle="draw a sprite"
        description="Using the mouse draw a sprite"
      >
        <div style={{ display: "grid" }}>
          <div>
            <Toolbar
              modes={modes}
              mode={mode}
              setMode={mode => setMode(mode)}
              clearAll={()=>handleClr()}
              undo={()=>handleUndo()}
              redo={()=>handleRedo()}
            />
          </div>
          <div>
            <canvas
              ref={canvasRef}
              width={pixelWidth * spriteArea.numberOfColumns + 1}
              height={pixelHeight * spriteArea.numberOfLines + 1}
            ></canvas>
          </div>
        </div>
      </StepperSection>
      <StepperSection title="Data" subtitle="add generated data" description="">
        <div>
          <div
            style={{ paddingLeft: "7px", paddingRight: "7px", width: "100%" }}
          >
            <span style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
              {spriteArea.getDataValue()}
            </span>
          </div>
          {spriteArea.area.length > 0 && (
            <div style={{ marginTop: "4px", display: "flex", width: "300px" }}>
              <div style={{ flex: "1" }}>
                <VSCodeButton
                  id="clr"
                  onClick={handleClr}
                  appearance="icon"
                  aria-label="clear"
                >
                  <span
                    slot="start"
                    className="codicon codicon-clear-all"
                  ></span>
                </VSCodeButton>
              </div>
              <div>
                <VSCodeButton id="add" onClick={handleGet} appearance="primary">
                  Get code
                  <span className="codicon codicon-chevron-left"></span>
                </VSCodeButton>
              </div>
              <div>
                <VSCodeButton id="add" onClick={handleAdd} appearance="primary">
                  Add code
                  <span className="codicon codicon-chevron-right"></span>
                </VSCodeButton>
              </div>
            </div>
          )}
          {spriteArea.area.length === 0 && (
            <div
              style={{
                color: "var(--vscode-input-placeholderForeground)",
                fontStyle: "italic",
              }}
            >
              data b1,b2,b3,...
            </div>
          )}
        </div>
      </StepperSection>
    </>
  );
}

export default SpriteEditor;
