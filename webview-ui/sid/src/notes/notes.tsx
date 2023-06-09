import React, { FC, useState } from "react";
import { vscode } from "../utilities/vscode";
import {
  VSCodePanels,
  VSCodePanelTab,
  VSCodePanelView,
  VSCodeButton,
} from "@vscode/webview-ui-toolkit/react";
import Title from "webview-common/build/Title";
import Subtitle from "webview-common/build/Subtitle";
import { INoteSystem } from "./models/models";
import note from "./data/note.json";
import bpmJiffies from "./data/bpmJiffiex.json";
import tempoBpm from "./data/tempoBpm.json";
import { VSCodeDropdown } from "@vscode/webview-ui-toolkit/react";
import { VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import { Tabs } from "@microsoft/fast-foundation";
import "../App.css";
import StepperSection from "../common/StepperSection";
import { ICurrentNote } from "./models/viewModels";
import System from "./system";
import Duration from "./durationRow";

const getDataValue = (currentNoteValues: ICurrentNote[]) => {
  return currentNoteValues.reduce((acc, curr, i) => {
    const note = `${curr.hi},${curr.lo},${curr.dr}`;
    if (i === 0) acc = `data ${note}`;
    else if (i % 3 === 0) acc = `${acc}\ndata ${note}`;
    else acc = `${acc},${note}`;
    return acc;
  }, "");
};

const DEFAULT_BPM = 112;

const Notes: FC = () => {
  const noteSystems: INoteSystem[] = note;
  const [bpm, setBpm] = useState(`${DEFAULT_BPM}`);
  const [currentJiffie, setCurrentJiffie] = useState(
    (bpmJiffies.find((x) => x.mm === DEFAULT_BPM) || { w: 128 }).w,
  );
  const [currentNoteValues, setCurrentNoteValues] = useState<ICurrentNote[]>(
    [],
  );
  const [currentSystem, setCurrentSystem] = useState("pal");

  const handleAdd = () => {
    const value = getDataValue(currentNoteValues);
    vscode.postMessage({
      command: "text",
      text: value,
    });
  };
  const handleDel = () => {
    setCurrentNoteValues(currentNoteValues.slice(0, -1));
  };

  const handleClr = () => {
    setCurrentNoteValues([]);
  };

  const handleBpm = (evt: Event | React.FormEvent<HTMLElement>) => {
    const element = evt.target as HTMLInputElement;
    setBpm(element.value);
  };

  const handleJiffie = (jiffie: number) => {
    if (jiffie) {
      setCurrentJiffie(jiffie);
    }
  };

  const handleCurrentNote = (hi: number, lo: number, dr: number) => {
    const newValues = [
      ...currentNoteValues,
      { hi, lo, dr: hi === -1 && lo === -1 ? -1 : dr },
    ];
    setCurrentNoteValues(newValues);
  };

  const handleOnChangeTab = (evt: Event | React.FormEvent<HTMLElement>) => {
    const element = evt.target as Tabs;
    setCurrentSystem(element.activeid);
    handleClr();
  };

  return (
    <>
      <Title text="Notes" />
      <Subtitle text="follow these steps to generate the data for a melody" />

      <StepperSection title="Bpm" subtitle="select a bpm value" description="">
        <VSCodeDropdown
          id="bpm"
          onChange={(e) => {
            handleBpm(e);
          }}
          value={`${bpm}`}
          style={{ height: "28px", width: "150px" }}
        >
          {bpmJiffies.map((t) => {
            const tempo = tempoBpm.find((x) => t.mm >= x.min && t.mm <= x.max);
            return (
              <VSCodeOption key={`${t.mm}`} value={`${t.mm}`}>
                {`${t.mm}${tempo ? ` - ${tempo.tempo}` : ""}`}
              </VSCodeOption>
            );
          })}
        </VSCodeDropdown>
      </StepperSection>

      <StepperSection
        title="Duration"
        subtitle={`select a note duration (dr) for bpm ${bpm}`}
        description="Note durations in terms of time units (jiffies). One jiffy lasts about 1/60 second. Loop on the system variable TI for the duration. 'All about the Commodore 64 - vol. 2' - Chamberlain, Craig"
      >
        <div style={{ display: "block" }}>
          <Duration
            bpm={bpm}
            defaultBpm={DEFAULT_BPM}
            handleJiffie={handleJiffie}
          />
          <div>
            Ex:
            <pre
              style={{
                fontSize: "0.75rem",
                cursor: "pointer",
                color: "var(--button-primary-background)",
                whiteSpace: "pre-line"
              }}
              className="clickable"
              onClick={() => {
                vscode.postMessage({
                  command: "text",
                  text: "81 if ti < tm+dr then 81\n82 tm = ti",
                });
              }}
            >81 if ti &lt; tm+dr then 81{"\n"}82 tm = ti</pre>
          </div>
        </div>
      </StepperSection>

      <StepperSection
        title="Notes"
        subtitle="compose a melody"
        description="Using the keyboard you select the Frequency low byte (lo), max:the Frequency high byte (hi) for each note"
      >
        <VSCodePanels activeid={currentSystem} onChange={handleOnChangeTab}>
          {noteSystems.map((s) => (
            <VSCodePanelTab id={s.system}>{s.system}</VSCodePanelTab>
          ))}
          {noteSystems.map((s) => (
            <VSCodePanelView id={s.system}>
              <System
                system={s.system}
                currentSystem={currentSystem}
                notes={s.notes}
                info={s.info}
                setCurrentNoteValues={(hi, lo) =>
                  handleCurrentNote(hi, lo, currentJiffie)
                }
              />
            </VSCodePanelView>
          ))}
        </VSCodePanels>
      </StepperSection>

      <StepperSection title="Data" subtitle="add generated data" description="">
        <div>
          <div
            style={{ paddingLeft: "7px", paddingRight: "7px", width: "100%" }}
          >
            <span style={{ fontFamily: "monospace", whiteSpace: "pre" }}>
              {getDataValue(currentNoteValues)}
            </span>
          </div>
          {currentNoteValues.length > 0 && (
            <div style={{ marginTop: "4px", display: "flex", width: "300px" }}>
              <div style={{ flex: "1" }}>
                <VSCodeButton
                  id="del"
                  onClick={handleDel}
                  appearance="icon"
                  aria-label="delete"
                >
                  <span slot="start" className="codicon codicon-discard"></span>
                </VSCodeButton>
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
                <VSCodeButton id="add" onClick={handleAdd} appearance="primary">
                  Add code
                  <span className="codicon codicon-chevron-right"></span>
                </VSCodeButton>
              </div>
            </div>
          )}
          {currentNoteValues.length === 0 && (
            <div
              style={{
                color: "var(--vscode-input-placeholderForeground)",
                fontStyle: "italic",
              }}
            >
              data hi,lo,dr,...
            </div>
          )}
        </div>
      </StepperSection>
    </>
  );
};

export default Notes;
