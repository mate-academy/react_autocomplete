import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { useDebounce } from './hooks/useDebounce';
import { Dropdown } from './components/Dropdown';

type Props = {
  delay?: number;
  onSelected: (person: Person) => void;
};

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const appliedQuery = useDebounce(query, delay);

  const filteredPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
  );

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    onSelected(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson === null
            ? `No selected person`
            : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              data-cy="search-input"
              onChange={event => {
                setQuery(event.target.value);
                setSelectedPerson(null);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {isFocused && (
            <Dropdown people={filteredPeople} onSelected={handleSelect} />
          )}
        </div>
      </main>
    </div>
  );
};
