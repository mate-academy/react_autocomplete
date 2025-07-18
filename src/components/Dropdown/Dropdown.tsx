import React, { useCallback, useState } from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  delay: number;
  onPersonSelect: (person: Person | null) => void;
};

function debounce<F extends (...args: any[]) => void>(
  callback: F,
  delay: number,
) {
  let timerId = 0;

  return (...args: Parameters<F>) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Dropdown: React.FC<Props> = React.memo(
  ({ people, delay, onPersonSelect = () => {} }) => {
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [isListClosed, setIsListClosed] = useState(true);

    const trimmedQuery = appliedQuery.trim();
    let filteredPeople: Person[];

    if (trimmedQuery === '') {
      filteredPeople = people;
    } else {
      filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(trimmedQuery.toLowerCase()),
      );
    }

    const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

    const handlePersonSelect = (person: Person) => {
      onPersonSelect(person);
      setQuery(person.name);
      setIsListClosed(true);
    };

    const handleQueryInputChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setQuery(event.target.value);
      setIsListClosed(false);
      onPersonSelect(null);

      if (event.target.value !== appliedQuery) {
        applyQuery(event.target.value);
      }
    };

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryInputChange}
            onFocus={() => setIsListClosed(false)}
          />
        </div>

        {!isListClosed && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handlePersonSelect(person)}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isListClosed && query && filteredPeople.length === 0 && (
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
    );
  },
);
