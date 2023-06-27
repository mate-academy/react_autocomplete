import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Person } from './types/Person';
import { debounce } from './helpers/debounce';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<null | Person>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isSuggestionsActive, setIsSuggestionsActive] = useState(false);

  const delay = 1000;
  const isDropdownVisible = isSuggestionsActive && appliedQuery;

  const selectPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery('');
    setAppliedQuery('');
    setIsSuggestionsActive(false);
  }, [selectedPerson]);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsSuggestionsActive(false);
  };

  const visiblePersons = useMemo(() => {
    const preparedQuery = appliedQuery.toLowerCase();

    setIsSuggestionsActive(true);

    return peopleFromServer.filter(person => {
      const preparedPersonName = person.name.toLowerCase();

      return preparedPersonName.includes(preparedQuery);
    });
  }, [peopleFromServer, appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No matching suggestions'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleChange}
          />
        </div>

        {isDropdownVisible && (
          <Dropdown
            persons={visiblePersons}
            selectPerson={selectPerson}
          />
        )}

      </div>
    </main>
  );
};
