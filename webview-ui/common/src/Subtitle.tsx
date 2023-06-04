import React, { FC, ReactElement } from "react";
import { ITitleParams } from "./Title";
import "./index.css";

const Subtitle: FC<ITitleParams> = ({
  text,
  children,
}): ReactElement | null => {
  if (children)
    return (
      <h5>
        {`${text}`} {children}
      </h5>
    );
  return <h5>{`${text}`}</h5>;
};

export default Subtitle;
