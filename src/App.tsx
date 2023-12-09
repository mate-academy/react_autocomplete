import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>();

  const visiblePerson = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase()
      .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const inputField = useRef<HTMLInputElement>(null);

  const showSugesstion = (appliedQuery === query) && isFocused;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            id="input"
            ref={inputField}
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        {showSugesstion && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {visiblePerson.length === 0
                ? (
                  <div className="dropdown-item">
                    <p className="has-text-danger">
                      No matching suggestions
                    </p>
                  </div>
                )
                : (
                  visiblePerson.map((person: Person) => (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <div
                      role="tooltip"
                      className="dropdown-item"
                      key={peopleFromServer.indexOf(person)}
                      onMouseDown={() => {
                        setQuery(person.name);
                        setSelectedPerson(person);
                      }}
                    >
                      <p className={person.sex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'}
                      >
                        {person.name}
                      </p>
                    </div>
                  )))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
