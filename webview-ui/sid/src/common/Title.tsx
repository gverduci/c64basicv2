import React, { FC, ReactElement } from 'react';

interface ITitleParams {
  text: string,
  children?: ReactElement | undefined
};

const Title: FC<ITitleParams> = ({text, children}): ReactElement => {
  if (children)
    return (<h4>{`${text}`} {children}</h4>);
  return (<h4>{`${text}`}</h4>);
}

export default Title;
