import React, { useState } from 'react';
import './App.scss';
import DropDown from './conponents/DropDown/DropDown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [title, setTitle] = useState<Person | null>(null);

  const { name, born, died } = title ? title : { name: '', born: '', died: '' };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title ? `${name} (${born} - ${died})` : 'No selected person'}
        </h1>

        <DropDown delay={300} onSelect={setTitle} />
      </main>
    </div>
  );
};
