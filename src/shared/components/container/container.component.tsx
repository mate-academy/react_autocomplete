import React from 'react';
import { ContainerProps } from './container.types';

export const ContainerComponent: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {children}
      </main>
    </div>
  );
};
