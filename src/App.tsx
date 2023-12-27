import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>();

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    if (event.target.value === '') {
      setSelectedPerson(null);
    }
  };

  const onMouseDownHandler = (person: Person) => () => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(appliedQuery.trim().toLowerCase()));
  }, [appliedQuery]);

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
            placeholder="Enter a name"
            className="input"
            value={query}
            onChange={handleInput}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div>

        {focused && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length ? (
                filteredPeople.map(person => (
                  <a
                    href="/"
                    role="menu"
                    tabIndex={0}
                    key={person.slug}
                    className="dropdown-item"
                    onMouseDown={onMouseDownHandler(person)}
                  >
                    <p className="has-text-link">
                      {person.name}
                    </p>
                  </a>
                ))
              ) : (
                <div className="dropdown-item">
                  <p className="has-text-danger">
                    No matching suggestions
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
