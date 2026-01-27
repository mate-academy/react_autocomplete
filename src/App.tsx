import './App.scss';
import React, { useState } from 'react';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {currentPerson
            ? `${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <Autocomplete people={peopleFromServer} onSelected={setCurrentPerson}>
            {({ value, onChange, onFocus }) => (
              <div className="dropdown-trigger">
                <input
                  type="text"
                  className="input"
                  placeholder="Enter a part of the name"
                  data-cy="search-input"
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  onFocus={onFocus}
                />
              </div>
            )}
          </Autocomplete>
        </div>
      </main>
    </div>
  );
};
