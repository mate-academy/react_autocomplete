import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { debounce } from './helpers/debounce';
import { Dropdown } from './components/Dropdown/dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [query, setQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const visiblePeople = useMemo(() => {
    return peopleFromServer.filter(people => people.name
      .toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const selectPerson = (personName: string) => {
    setSelectedPerson(
      peopleFromServer.find(person => person.name === personName),
    );
    setQuery(personName);
  };

  const applyQuery = useCallback(debounce(setQuery, 1000), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsDropdownActive(true)}
            onBlur={() => setIsDropdownActive(false)}
          />
        </div>
        {isDropdownActive && (
          <Dropdown
            people={visiblePeople}
            onSelect={selectPerson}
          />
        )}
      </div>
    </main>
  );
};
