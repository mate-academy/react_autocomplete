import { useCallback, useState } from 'react';

import { peopleFromServer } from '../../data/people';

import { Person } from '../../types/Person';

type Props = {
  onSelected: (person: Person) => void;
  onInputChange: () => void;
  delay?: number;
};

const debounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
) => {
  let timerId: number;

  return (...args: T) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

const filterPeopleByName = (people: Person[], query: string) => {
  return people.filter(person =>
    person.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
};

export const Dropdown = ({
  onSelected = () => {},
  onInputChange = () => {},
  delay = 300,
}: Props) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSetQuery = useCallback(
    debounce((value: string) => {
      setDebouncedQuery(value);
    }, delay),
    [delay],
  );

  const handleInputChange = (value: string) => {
    setQuery(value);
    onInputChange();

    if (value.trim() === '') {
      setDebouncedQuery('');

      return;
    }

    debouncedSetQuery(value);
  };

  const handlePersonSelect = (person: Person) => {
    setQuery(person.name);
    setDebouncedQuery(person.name);
    setIsFocused(false);

    onSelected(person);
  };

  const people = filterPeopleByName(peopleFromServer, debouncedQuery);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={event => handleInputChange(event.target.value)}
        />
      </div>

      {isFocused && (
        <>
          {people.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {people.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item is-clickable"
                    data-cy="suggestion-item"
                    onMouseDown={() => handlePersonSelect(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {people.length === 0 && (
            <div
              className="notification is-danger is-light mt-3"
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
