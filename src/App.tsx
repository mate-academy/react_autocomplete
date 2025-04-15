import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const initialPerson: Person[] = peopleFromServer.map(person => ({
  ...person,
}));

export const App: React.FC = () => {
  const [isInputFocus, setInputFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [person, setPerson] = useState<Person | null>(null);

  const normalizedQuery = appliedQuery.toLowerCase();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setPerson(null);
  };

  const onSelected = (selectedPerson: Person) => {
    setInputFocus(false);
    setPerson(selectedPerson);
    setQuery(selectedPerson.name);
  };

  const filteredPersons = useMemo(() => {
    return initialPerson.filter(persn =>
      persn.name.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {`${person ? `${person?.name} (${person?.born} - ${person?.died})` : 'No selected person'}`}
        </h1>

        <div className={`dropdown ${isInputFocus ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => {
                setInputFocus(true);
              }}
              onChange={handleQueryChange}
            />
          </div>
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPersons.map(persn => (
                <div
                  key={persn.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => onSelected(persn)}
                >
                  <p className="has-text-link">{persn.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredPersons.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
