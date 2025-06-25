import React, { useCallback, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Persons } from './component/Persons';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

interface AppProps {
  delay?: number;
}

export const App: React.FC<AppProps> = ({ delay = 300 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(peopleFromServer);
  const [isActive, setIsActive] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const previousSearchTerm = useRef<string>('');

  const debouncedFilter = useCallback(
    debounce((query: string) => {
      if (query.trim() === previousSearchTerm.current) {
        return;
      }

      previousSearchTerm.current = query.trim();

      const filtered = peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(query.trim().toLowerCase()),
      );

      setFilteredPeople(filtered);
    }, delay),
    [delay],
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.trim() === '') {
      setFilteredPeople(peopleFromServer);
      setSearchTerm('');

      return;
    }

    setSearchTerm(value);
    setSelectedPerson(null);

    debouncedFilter(value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsActive(false);
      setFilteredPeople(peopleFromServer);
    }, 150);
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleSelected = (person: Person) => {
    setSelectedPerson(person);
    setSearchTerm(`${person.name} (${person.born} - ${person.died})`);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson === null
            ? 'No selected person'
            : `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`}
        </h1>

        <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <Persons peoples={filteredPeople} onSelected={handleSelected} />
        </div>
      </main>
    </div>
  );
};
