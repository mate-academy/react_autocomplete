import React, { useState } from 'react';
import './App.scss';
import { Menu } from './components/Menu';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const delay = 1000;

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const { name, born, died } = peopleFromServer[0];

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {`${name} (${born} = ${died})`}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleQueryChange}
          />
        </div>

        <Menu
          people={peopleFromServer}
          delay={delay}
          onSelect={setSelectedPerson}
        />
      </div>
    </main>
  );
};
