import React, { FC, ReactElement } from "react";

export interface IStepperSectionParams {
  title: string;
  subtitle: string;
  description: string;
  children?: ReactElement | undefined;
}

const StepperSection: FC<IStepperSectionParams> = ({
  title,
  subtitle,
  description,
  children,
}): ReactElement => {
  return (
    <div
      style={{
        display: "grid",
        gap: "0px 0.8rem",
        gridTemplateColumns: "24px auto",
        gridAutoFlow: "column",
        marginBottom: "2.4rem",
      }}
    >
      <header>
        <span
          style={{ textTransform: "uppercase", textAlign: "left" }}
        >{`${title}`}</span>
        <span
          style={{ textAlign: "left", marginLeft: "8px" }}
        >{`${subtitle}`}</span>
      </header>
      <div style={{ display: "block" }}>
        <p>{`${description}`}</p>
        <div
          style={{
            alignItems: "stretch",
            display: "flex",
            flexDirection: "row-reverse",
            gap: "1.6rem",
            justifyContent: "flex-end",
          }}
        >
          {children}
        </div>
      </div>
      <span className="checkline">
        <span
          className="codicon codicon-circle"
          style={{ fontSize: "x-large" }}
        ></span>
      </span>
    </div>
  );
};

export default StepperSection;
