import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const Container: React.FC<Props> = ({ children }) => {
  return <div className="container">{children}</div>;
};
