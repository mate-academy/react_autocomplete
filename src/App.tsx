import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { DropDownMenu } from './components/DropDownMenu/DropDownMenu';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isInputFocused, setInputFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonSelect = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setInputFocused(false);
  }, []);

  const filteredPersons = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase()
      .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  // const { name, born, died } = peopleFromServer[0];

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleInputFocus}
          />
        </div>

        {isInputFocused && (
          <DropDownMenu
            people={filteredPersons}
            onSelect={handlePersonSelect}
          />
        )}
      </div>
    </main>
  );
};
