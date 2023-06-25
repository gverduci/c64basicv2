import {
  VSCodeDataGrid,
  VSCodeDataGridCell,
  VSCodeDataGridRow,
} from "@vscode/webview-ui-toolkit/react";
import { FC, useEffect, useState } from "react";
import { IDurationRowView, IDurationView } from "./models/viewModels";
import bpmJiffies from "./data/bpmJiffiex.json";

const DurationRow: FC<IDurationRowView> = ({
  jiffies,
  currentJiffieIdx,
  handleJiffie,
  dot,
}) => (
  <VSCodeDataGridRow gridTemplateColumns="50px 50px 50px 50px 50px 50px 50px">
    {jiffies.map((jiffie, i) => {
      const index = i + 10 * dot;
      let newJiffie = jiffie;
      let dottedJiffie = jiffie;
      for (let d = 0; d < dot; d++) {
        if (newJiffie % 2 === 0) {
          newJiffie = Math.floor(newJiffie / 2);
          dottedJiffie = dottedJiffie + newJiffie;
        } else {
          newJiffie = 0;
          dottedJiffie = 0;
        }
      }
      if (dottedJiffie)
        return (
          <VSCodeDataGridCell
            grid-column={i + 1}
            onClick={() => handleJiffie(dottedJiffie, index)}
          >
            <span
              style={{
                textAlign: "center",
                fontSize: "large",
                fontWeight: index === currentJiffieIdx ? 700 : 400,
                color:
                  index === currentJiffieIdx
                    ? "var(--button-primary-background)"
                    : "inherit",
              }}
            >
              {`${String.fromCodePoint(119133 + i)}${".".repeat(dot)}`}
            </span>
          </VSCodeDataGridCell>
        );
      return null;
    })}
  </VSCodeDataGridRow>
);

/**
 * https://archive.org/details/Compute_s_All_About_the_Commodore_64_Volume_Two/page/284/mode/2up
 */
const Duration: FC<IDurationView> = ({ bpm, defaultBpm, handleJiffie }) => {
  const [currentJiffieIdx, setCurrentJiffieIdx] = useState(0);
  const [jiffies, setJiffies] = useState(
    Object.values(bpmJiffies.find((x) => x.mm === defaultBpm) || {}).slice(1),
  );

  useEffect(() => {
    const jiffiesObj = bpmJiffies.find((r) => `${r.mm}` === bpm);
    setJiffies(jiffiesObj ? Object.values(jiffiesObj).slice(1) : []);
    setCurrentJiffieIdx(0);
    handleJiffie(jiffiesObj ? jiffiesObj.w : 128);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm]);

  return (
    <VSCodeDataGrid>
      <DurationRow
        jiffies={jiffies}
        currentJiffieIdx={currentJiffieIdx}
        handleJiffie={(jiffie, index) => {
          handleJiffie(jiffie);
          setCurrentJiffieIdx(index);
        }}
        dot={0}
      />
      <DurationRow
        jiffies={jiffies}
        currentJiffieIdx={currentJiffieIdx}
        handleJiffie={(jiffie, index) => {
          handleJiffie(jiffie);
          setCurrentJiffieIdx(index);
        }}
        dot={1}
      />
      <DurationRow
        jiffies={jiffies}
        currentJiffieIdx={currentJiffieIdx}
        handleJiffie={(jiffie, index) => {
          handleJiffie(jiffie);
          setCurrentJiffieIdx(index);
        }}
        dot={2}
      />
    </VSCodeDataGrid>
  );
};

export default Duration;
