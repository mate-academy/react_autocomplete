import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './Autocomplete';

export const App: React.FC = () => {
  const [title, setTitle] = useState<Person | null>(null);
  const { name, born, died } = title ?? {};
  const delay = 300;
  const handleSelected = (person: Person) => setTitle(person);
  const handleInputNotify = (value: string) => {
    if (title && value !== title.name) {
      setTitle(null);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title ? `${name} (${born} - ${died})` : 'No selected person'}
        </h1>

        <Autocomplete
          delay={delay}
          peopleFromServer={peopleFromServer}
          onSelected={handleSelected}
          onInputChange={handleInputNotify}
        />
      </main>
    </div>
  );
};
