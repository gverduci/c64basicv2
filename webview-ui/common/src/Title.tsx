import React, { FC, ReactElement } from 'react';
import './index.css';

export interface ITitleParams {
  text: string,
  children?: ReactElement | null | undefined
};

const Title: FC<ITitleParams> = ({text, children}): ReactElement | null => {
  if (children)
    return (<h4>{`${text}`} {children}</h4>);
  return (<h4>{`${text}`}</h4>);
}

export default Title;
