import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

type DebouncedFunction = (...args: string[]) => void;

function debounce(callback: DebouncedFunction, delay: number) {
  let timerId: number;

  return (...arg: string[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...arg);
    }, delay);
  };
}

type Props = {
  delay: number;
  selectedPerson: Person | null;
  setSelectedPerson: (peson: Person | null) => void;
};

export const PeopleList: React.FC<Props> = React.memo(
  ({ delay, selectedPerson, setSelectedPerson }) => {
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');

    const applyQuery = useCallback(
      (value: string) => setAppliedQuery(value),
      [],
    );

    const debounceCall = debounce(applyQuery, delay);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.currentTarget.value);
      setSelectedPerson(null);
      debounceCall(event.currentTarget.value);
    };

    const filteredPeople = useMemo(() => {
      return peopleFromServer.filter((person: Person) =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      );
    }, [appliedQuery]);

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {!selectedPerson && filteredPeople.length !== 0 && (
            <div className="dropdown-content">
              {filteredPeople.map((person: Person) => (
                <button
                  type="button"
                  key={person.slug}
                  className="dropdown-item button is-white"
                  data-cy="suggestion-item"
                  onClick={() => setSelectedPerson(person)}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </button>
              ))}
            </div>
          )}
          {!selectedPerson && filteredPeople.length === 0 && (
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
      </div>
    );
  },
);
