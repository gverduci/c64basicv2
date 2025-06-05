import React, { FC, ReactElement, useEffect, useState } from "react";
import { vscode } from "./utilities/vscode";
import {
  VSCodeDataGrid,
  VSCodeDataGridRow,
  VSCodeDataGridCell,
  VSCodePanels,
  VSCodePanelTab,
  VSCodePanelView,
} from "@vscode/webview-ui-toolkit/react";
import Title from "webview-common/build/Title";
import Subtitle from "webview-common/build/Subtitle";
import Palette from "./common/palette";
import Byte from "./common/byte";

interface IbitObj {
  name: string;
  value: string | number;
}

interface IbitValue {
  bit: string;
  names: IbitObj[];
}

interface IRegister {
  addr: number;
  bits: IbitValue[];
  rw: string;
}

interface IRegisterProps {
  registers: IRegister[];
  registerValues: number[];
  handleAddressClick: (snippet: string) => void;
  handleAddressAndValueClick: (snippet: string) => void;
  handleSetRegisterValueClick: (resister: number, value: number) => void;
}

interface IRegisterOccurrenceProps extends IRegisterProps {
  occurrence: number;
}

const spriteCoordinate = [
  {
    addr: 0,
    bits: [
      { bit: "7..0", names: [{ name: "X-Coordinate Sprite#0", value: "" }] },
    ],
    rw: "w",
  },
  {
    addr: 1,
    bits: [
      { bit: "7..0", names: [{ name: "Y-Coordinate Sprite#0", value: "" }] },
    ],
    rw: "w",
  },
  {
    addr: 2,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "X-Coordinate Sprite#1", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 3,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "Y-Coordinate Sprite#1", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 4,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "X-Coordinate Sprite#2", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 5,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "Y-Coordinate Sprite#2", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 6,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "X-Coordinate Sprite#3", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 7,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "Y-Coordinate Sprite#3", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 8,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "X-Coordinate Sprite#4", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 9,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "Y-Coordinate Sprite#4", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 10,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "X-Coordinate Sprite#5", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 11,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "Y-Coordinate Sprite#5", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 12,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "X-Coordinate Sprite#6", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 13,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "Y-Coordinate Sprite#6", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 14,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "X-Coordinate Sprite#7", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 15,
    bits: [
      {
        bit: "7..0",
        names: [{ name: "Y-Coordinate Sprite#7", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 16,
    bits: [
      {
        bit: "7..0",
        names: [
          { name: "X-Coordinate Extension Sprite", value: "" },
          { name: "$byte", value: "$byte" },
        ],
      },
    ],
    rw: "w",
  },
];

const other = [
  {
    addr: 17,
    bits: [
      {
        bit: "7",
        names: [{ name: "9th Bit for v+18 Rasterline counter", value: "" }],
      },
      {
        bit: "6",
        names: [{ name: "Turn Extended Color Mode on/off", value: "" }],
      },
      {
        bit: "5",
        names: [{ name: "Turn Bitmap Mode on/off", value: "" }],
      },
      {
        bit: "4",
        names: [{ name: "Switch VIC-II output on/off", value: "" }],
      },
      {
        bit: "3",
        names: [{ name: "Switch betweem 25 or 24 visible rows", value: "" }],
      },
      {
        bit: "2..0",
        names: [{ name: "Screen Soft Scroll Vertical ", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 18,
    bits: [{ bit: "7..0", names: [{ name: "Raster Counter", value: "" }] }],
    rw: "w",
  },
  {
    addr: 19,
    bits: [
      { bit: "7..0", names: [{ name: "Light Pen X-Coordinate", value: "" }] },
    ],
    rw: "w",
  },
  {
    addr: 20,
    bits: [
      { bit: "7..0", names: [{ name: "Light Pen Y-Coordinate", value: "" }] },
    ],
    rw: "w",
  },
  {
    addr: 22,
    bits: [
      { bit: "7..5", names: [{ name: "-", value: "" }] },
      {
        bit: "4",
        names: [{ name: "Turn Multicolor Mode on/off ", value: 16 }],
      },
      {
        bit: "3",
        names: [{ name: "Switch betweem 40 or 38 visible columns", value: 8 }],
      },
      {
        bit: "2..0",
        names: [{ name: "Screen Soft Scroll Horizontal ", value: "" }],
      },
    ],
    rw: "w",
  },
  {
    addr: 24,
    bits: [
      {
        bit: "7..4",
        names: [
          { name: "Address Bits 10-13 of the Screen RAM (*1024)", value: "" },
        ],
      },
      {
        bit: "3..1",
        names: [
          {
            name: "Address Bits 11-13 of the Character Set (*2048)",
            value: "",
          },
        ],
      },
      { bit: "0", names: [{ name: "-", value: "" }] },
    ],
    rw: "w",
  },
  {
    addr: 25,
    bits: [
      {
        bit: "7",
        names: [
          {
            name: "If set high at least one of the Interrupts below were triggered ",
            value: "",
          },
        ],
      },
      { bit: "6.4", names: [{ name: "-", value: "" }] },
      {
        bit: "3",
        names: [
          {
            name: "Interrupt by Lightpen impulse triggered when high",
            value: "",
          },
        ],
      },
      {
        bit: "2",
        names: [
          {
            name: "Interrupt by Sprite-Sprite collision triggered when high",
            value: "",
          },
        ],
      },
      {
        bit: "1",
        names: [
          {
            name: "Interrupt by Spite-Background collision triggered when high",
            value: "",
          },
        ],
      },
      {
        bit: "0",
        names: [
          { name: "Interrupt by Rasterline triggered when high", value: "" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 26,
    bits: [
      { bit: "7.4", names: [{ name: "-", value: "" }] },
      {
        bit: "3",
        names: [
          {
            name: "Request Interrupt by Lightpen impulse by setting high",
            value: "",
          },
        ],
      },
      {
        bit: "2",
        names: [
          {
            name: "Request Interrupt by Sprite-Sprite collision by setting high",
            value: "",
          },
        ],
      },
      {
        bit: "1",
        names: [
          {
            name: "Request Interrupt by Spite-Background collision by setting high",
            value: "",
          },
        ],
      },
      {
        bit: "0",
        names: [
          {
            name: "Request Interrupt by Rasterline by setting high",
            value: "",
          },
        ],
      },
    ],
    rw: "w",
  },
];

const spriteOther = [
  {
    addr: 21,
    bits: [
      {
        bit: "7..0",
        names: [
          { name: "Enable Sprite", value: "" },
          { name: "$byte", value: "$byte" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 23,
    bits: [
      {
        bit: "7..0",
        names: [
          { name: "Y Expansion Sprite", value: "" },
          { name: "$byte", value: "$byte" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 27,
    bits: [
      {
        bit: "7..0",
        names: [
          { name: "Sprite Collision Priority Sprite", value: "" },
          { name: "$byte", value: "$byte" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 28,
    bits: [
      {
        bit: "7..0",
        names: [
          { name: "Sprite Multicolor Sprite", value: "" },
          { name: "$byte", value: "$byte" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 29,
    bits: [
      {
        bit: "7..0",
        names: [
          { name: "Sprite X Expansion Sprite", value: "" },
          { name: "$byte", value: "$byte" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 30,
    bits: [
      {
        bit: "7..0",
        names: [
          { name: "Sprite-Sprite Collision Sprite", value: "" },
          { name: "$byte", value: "$byte" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 31,
    bits: [
      {
        bit: "7..0",
        names: [
          { name: "Sprite-Background Collision Sprite", value: "" },
          { name: "$byte", value: "$byte" },
        ],
      },
    ],
    rw: "w",
  },
];

const colors = [
  {
    addr: 32,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Border color", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 33,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Backgr. Color 0", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 34,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Backgr. Color 1", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 35,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Backgr. Color 2", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 36,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Backgr. Color 3", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
];
const spriteColors = [
  {
    addr: 37,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Spr. Multicolor 0", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 38,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Spr. Multicolor 1", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 39,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Color spr. 0", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 40,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Color spr. 1", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 41,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Color spr. 2", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 42,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Color spr. 3", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 43,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Color spr. 4", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 44,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Color spr. 5", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 45,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Color spr. 6", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
  {
    addr: 46,
    bits: [
      { bit: "7..4", names: [{ name: "-", value: "" }] },
      {
        bit: "3..0",
        names: [
          { name: "Color spr. 7", value: "" },
          { name: "$palette", value: "$palette" },
        ],
      },
    ],
    rw: "w",
  },
];

const TabOccurrenceGrid: FC<IRegisterOccurrenceProps> = ({
  registers,
  registerValues,
  occurrence,
  handleAddressClick,
  handleAddressAndValueClick,
  handleSetRegisterValueClick,
}): ReactElement => (
  <VSCodeDataGrid gridTemplateColumns="60px 440px">
    <VSCodeDataGridRow row-type="header">
      <VSCodeDataGridCell cell-type="columnheader" grid-column="1">
        reg.
      </VSCodeDataGridCell>
      <VSCodeDataGridCell cell-type="columnheader" grid-column="2">
        bits
      </VSCodeDataGridCell>
    </VSCodeDataGridRow>
    {registers.map((row, index) => {
      let address = row.addr;
      if (occurrence) {
        address = address + (occurrence - 1) * 7;
      }
      return (
        <VSCodeDataGridRow key={`row${index}`}>
          <VSCodeDataGridCell
            cell-type="columnheader"
            grid-column="1"
            style={{
              cursor: "pointer",
              color: "var(--button-primary-background)",
            }}
            className="clickable"
            onClick={() => handleAddressClick(`poke v+${address},`)}
          >{`v+${address}`}</VSCodeDataGridCell>
          <VSCodeDataGridCell grid-column="2">
            {row.bits.map((b, index) => (
              <div
                key={`bit${index}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "30px auto auto",
                  width: "100%",
                }}
              >
                <div>{b.bit}</div>
                {b.names.map((n, index) => {
                  if (n.value === "$byte") {
                    return (
                      <div style={{ justifyContent: "right", display: "flex" }}>
                        <Byte
                          value={registerValues[address]}
                          selectCallback={(value) =>
                            handleSetRegisterValueClick(address, value)
                          }
                          addToCode={() =>
                            handleAddressAndValueClick(
                              `poke v+${address},${registerValues[address]}`,
                            )
                          }
                        />
                      </div>
                    );
                  }
                  if (n.value === "$palette") {
                    return (
                      <div style={{ justifyContent: "right", display: "flex" }}>
                      <Palette
                        selectCallback={(color) =>
                          handleAddressAndValueClick(
                            `poke v+${address},${color}`,
                          )
                        }
                      />
                      </div>
                    );
                  }
                  if (n.value !== "") {
                    return (
                      <div
                        key={`name${index}`}
                        style={{
                          paddingRight: "8px",
                          cursor: "pointer",
                          color: "var(--button-primary-background)",
                        }}
                        onClick={() =>
                          handleAddressAndValueClick(
                            `poke v+${address},${n.value}`,
                          )
                        }
                      >
                        {n.name}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={`name${index}`}
                      style={{ display: "table-cell", paddingRight: "8px" }}
                    >
                      {n.name}
                    </div>
                  );
                })}
              </div>
            ))}
          </VSCodeDataGridCell>
        </VSCodeDataGridRow>
      );
    })}
  </VSCodeDataGrid>
);

const TabGrid: FC<IRegisterProps> = ({
  registers,
  registerValues,
  handleAddressClick,
  handleAddressAndValueClick,
  handleSetRegisterValueClick,
}): ReactElement => (
  <TabOccurrenceGrid
    registers={registers}
    registerValues={registerValues}
    occurrence={0}
    handleSetRegisterValueClick={handleSetRegisterValueClick}
    handleAddressClick={handleAddressClick}
    handleAddressAndValueClick={handleAddressAndValueClick}
  />
);

function VicAddresses() {
  const [registerValues, setRegisterValues] = useState<number[]>([]);
  useEffect(() => {
    const addrs: number[] = [];
    for (let index = 0; index < 46; index++) {
      addrs.push(0);
    }
    setRegisterValues(addrs);
  }, []);
  const handleAddressAndValueClick = (snippet: string) => {
    vscode.postMessage({
      command: "text",
      text: snippet,
    });
  };
  const handleAddressClick = (snippet: string) => {
    vscode.postMessage({
      command: "snippet",
      text: snippet,
    });
  };
  const handleAddressBaseClick = (address: string) => {
    vscode.postMessage({
      command: "text",
      text: address,
    });
  };
  const handleSetRegisterValueClick = (register: number, value: number) => {
    const newRegValues = [...registerValues];
    newRegValues[register] = value;
    setRegisterValues(newRegValues);
  };

  return (
    <>
      <Title text="VIC Addresses">
        <span
          style={{
            margin: 0,
            cursor: "pointer",
            color: "var(--button-primary-background)",
          }}
          className="clickable"
          onClick={() => handleAddressBaseClick("v=53248")}
        >
          (v=53248)
        </span>
      </Title>
      <Subtitle text="click on registry, or on bits, to copy the corresponding poke command" />
      <VSCodePanels>
        <VSCodePanelTab id="tab-1">Sprite Coordinates</VSCodePanelTab>
        <VSCodePanelTab id="tab-2">Others</VSCodePanelTab>
        <VSCodePanelTab id="tab-3">Sprite Others</VSCodePanelTab>
        <VSCodePanelTab id="tab-4">Colors</VSCodePanelTab>
        <VSCodePanelTab id="tab-5">Sprite Colors</VSCodePanelTab>
        <VSCodePanelView id="view-1">
          <TabGrid
            registers={spriteCoordinate}
            registerValues={registerValues}
            handleSetRegisterValueClick={handleSetRegisterValueClick}
            handleAddressClick={handleAddressClick}
            handleAddressAndValueClick={handleAddressAndValueClick}
          />
        </VSCodePanelView>
        <VSCodePanelView id="view-2">
          <TabGrid
            registers={other}
            registerValues={registerValues}
            handleSetRegisterValueClick={handleSetRegisterValueClick}
            handleAddressClick={handleAddressClick}
            handleAddressAndValueClick={handleAddressAndValueClick}
          />
        </VSCodePanelView>
        <VSCodePanelView id="view-3">
          <TabGrid
            registers={spriteOther}
            registerValues={registerValues}
            handleSetRegisterValueClick={handleSetRegisterValueClick}
            handleAddressClick={handleAddressClick}
            handleAddressAndValueClick={handleAddressAndValueClick}
          />
        </VSCodePanelView>
        <VSCodePanelView id="view-4">
          <TabGrid
            registers={colors}
            registerValues={registerValues}
            handleSetRegisterValueClick={handleSetRegisterValueClick}
            handleAddressClick={handleAddressClick}
            handleAddressAndValueClick={handleAddressAndValueClick}
          />
        </VSCodePanelView>
        <VSCodePanelView id="view-5">
          <TabGrid
            registers={spriteColors}
            registerValues={registerValues}
            handleSetRegisterValueClick={handleSetRegisterValueClick}
            handleAddressClick={handleAddressClick}
            handleAddressAndValueClick={handleAddressAndValueClick}
          />
        </VSCodePanelView>
      </VSCodePanels>
    </>
  );
}

export default VicAddresses;
