import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

interface AutocompleteProps {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const App: React.FC<AutocompleteProps> = ({ delay, onSelected }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  //eslint-disable-next-line
  const [selectedPerson, setSelectedPerson] = useState<null | (typeof peopleFromServer)[0]
  >(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleDebounceQuery = useCallback(
    debounce((value: string) => setDebouncedQuery(value), 300),
    [delay],
  );

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: React.SetStateAction<string> = event.target.value;

    setQuery(value);
    handleDebounceQuery(value);
    setSelectedPerson(null);
  };

  const filteredPeople = useMemo(() => {
    if (debouncedQuery === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.trim().includes(debouncedQuery),
    );
  }, [debouncedQuery]);

  const handleSelectedPerson = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    person: Person,
  ) => {
    e.stopPropagation();

    setQuery(person.name);
    setSelectedPerson(person);
    onSelected(person);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 100);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
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
              data-cy="search-input"
              value={query}
              onChange={handleChangeInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          {filteredPeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    key={person.name}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={e => handleSelectedPerson(e, person)}
                  >
                    <p
                      className={
                        person.sex === 'f' ? 'has-text-danger' : 'has-text-link'
                      }
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isFocused && !selectedPerson && debouncedQuery.trim() && (
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
        </div>
      </main>
    </div>
  );
};
