import React, { FC, ReactElement } from "react";

export interface IToolbarProps {
  modes: string[];
  mode: string;
  setMode: (mode: string) => void,
  clearAll: () => void,
  undo: () => void,
  redo: () => void,
}

const modeIcons: { [id: string]: string } = {
  "DRAW": "codicon-edit",
  "ERASE": "codicon-trash",
  "MOVE": "codicon-move",
};

const Toolbar: FC<IToolbarProps> = ({ modes, mode, setMode, clearAll, undo, redo }): ReactElement | null => {
  return (
    <div>
      {modes.map((m) => {
        return (
          <>
            <span
              style={{
                height: "16px",
                width: "16px",
                maxHeight: "16px",
                maxWidth: "16px",
                fontSize: "var(--type-ramp-base-font-size)",
                color: m === mode ? "var(--vscode-inputOption-activeForeground)": "var(--vscode-disabledForeground)",
              }}
              slot="top"
              className={`codicon ${modeIcons[m]}`}
              onClick={() => setMode(m)}
            >
              &nbsp;
            </span>
          </>
        );
      })}
      <span
        style={{
          height: "16px",
          width: "16px",
          maxHeight: "16px",
          maxWidth: "16px",
          fontSize: "var(--type-ramp-base-font-size)",
        }}
        slot="top"
        className={"codicon codicon-clear-all"}
        onClick={() => clearAll()}
      >
        &nbsp;
      </span> 
      <span
        style={{
          height: "16px",
          width: "16px",
          maxHeight: "16px",
          maxWidth: "16px",
          fontSize: "var(--type-ramp-base-font-size)",
        }}
        slot="top"
        className={"codicon codicon-discard"}
        onClick={() => undo()}
      >
        &nbsp;
      </span> 
      <span
        style={{
          height: "16px",
          width: "16px",
          maxHeight: "16px",
          maxWidth: "16px",
          fontSize: "var(--type-ramp-base-font-size)",
        }}
        slot="top"
        className={"codicon codicon-redo"}
        onClick={() => redo()}
      >
        &nbsp;
      </span> 
    </div>
  );
};

export default Toolbar;
