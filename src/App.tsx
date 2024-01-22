import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import Dropdown from './components/dropdown/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');

  const [focus, setFocus] = useState<boolean>(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const filteredPeoples = useMemo(() => {
    return peopleFromServer
      .filter(person => person
        .name.toLowerCase().includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  function formatPersonInfo(person: Person) {
    const { name, born, died } = person;

    return `${name} (${born} = ${died})`;
  }

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  return (
    <main className="section">
      {selectedPerson ? (
        <h1 className="title">
          {formatPersonInfo(selectedPerson)}
        </h1>
      ) : (
        <h1 className="title">
          No selected person
        </h1>
      )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
          />
        </div>
        {focus && (
          <Dropdown
            peoples={filteredPeoples}
            onSelect={setSelectedPerson}
            setQuery={setQuery}
            handleBlur={handleBlur}
          />
        )}
      </div>
    </main>
  );
};
