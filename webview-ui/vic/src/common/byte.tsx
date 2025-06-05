import React, { FC, ReactElement } from "react";

export interface IByte {
  value: number;
  selectCallback: (color: number) => void;
  addToCode: () => void;
}

const Byte: FC<IByte> = ({ value, selectCallback, addToCode }): ReactElement | null => {
  const expByte = [
    value & 128,
    value & 64,
    value & 32,
    value & 16,
    value & 8,
    value & 4,
    value & 2,
    value & 1,
  ];
  return (
    <div>
      {expByte.map((bit, i) => {
        const icon = bit
          ? "codicon-circle-large-filled"
          : "codicon-circle-large";
        return (
          <>
            <span
              style={{
                height: "16px",
                width: "16px",
                maxHeight: "16px",
                maxWidth: "16px",
                fontSize: "var(--type-ramp-base-font-size)",
              }}
              slot="top"
              className={`codicon ${icon}`}
              onClick={() => selectCallback(value ^ (1 << (7 - i)))}
            >
              {7 - i}
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
        onClick={() => selectCallback(0)}
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
        className={"codicon codicon-chevron-right"}
        onClick={() => addToCode()}
      >
        &nbsp;
      </span>
    </div>
  );
};

export default Byte;
