import React, { useMemo, useState } from 'react';
import { Person } from '../types/Person';

interface Props {
  delay?: number;
  person: Person[];
  selectedPerson?: Person;
  onSelected: (person: Person | null) => void;
}

function debounce<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number,
) {
  let timerId = 0;

  return (...args: Parameters<T>) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Autocomplete: React.FC<Props> = ({
  person,
  delay = 300,
  onSelected = () => {},
  selectedPerson,
}) => {
  const [query, setQuery] = useState<string>(''); // caroulos
  const [appliedQuery, setAppliedQuery] = useState(''); // duvida pq ter essa appliedQuery e de onde ela vem

  const [isActive, setIsActive] = useState<boolean>(false);

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const applyQuery = useMemo(
    () => debounce((value: string) => setAppliedQuery(value), delay), // appliedQuery tera o mesmo valor de query
    [delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setQuery(newValue);
    applyQuery(newValue);

    if (newValue !== selectedPerson?.name) {
      onSelected(null);
    }
  };

  const suggestions = useMemo(() => {
    const normalized = appliedQuery.trim().toLowerCase();

    if (normalized.length === 0) {
      return person;
    }

    return person.filter(item => {
      const nam = item.name.toLowerCase();

      return nam.includes(normalized);
    });
  }, [appliedQuery, person]); //dependencias

  return (
    <>
      <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map((people) => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={people.slug}
              >
                <a
                  href="#"
                  className="has-text-link"
                  onMouseDown={() => {
                    onSelected(people);
                    setIsActive(false);
                    setQuery(people.name);
                    setAppliedQuery(people.name);
                  }}
                >
                  {people.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      {suggestions.length === 0 && appliedQuery.length !== 0 && (
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
    </>
  );
};
// (onMouseDown → onBlur → onClick)
