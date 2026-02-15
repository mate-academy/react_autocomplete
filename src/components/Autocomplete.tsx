import React, { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [shownPeople, setShownPeople] = useState<Person[]>(people);
  const [focused, setFocused] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  useEffect(() => {
    setShownPeople(people);
  }, [people]);

  const debouncedFilter = useMemo(
    () =>
      debounce((query: string) => {
        const queryLow = query.toLowerCase().trim();

        if (!queryLow) {
          setShownPeople(people);

          return;
        }

        const filtered = people.filter(person =>
          person.name.toLowerCase().includes(queryLow),
        );

        setShownPeople(filtered);
      }, delay),
    [people, delay],
  );

  useEffect(() => {
    return () => {
      debouncedFilter.cancel();
    };
  }, [debouncedFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setCurrentQuery(value);
    onSelected(null);

    debouncedFilter(value);
  };

  const handleSelect = (person: Person) => {
    setCurrentQuery(person.name);
    onSelected(person);
    setFocused(false);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': focused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={currentQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleInputChange}
        />
      </div>

      {focused && shownPeople.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {shownPeople.map(person => (
              <a
                onMouseDown={() => handleSelect(person)}
                key={person.slug}
                className={classNames('dropdown-item', {
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
                data-cy="suggestion-item"
                style={{ cursor: 'pointer' }}
              >
                {person.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {focused && shownPeople.length === 0 && currentQuery !== '' && (
        <div
          className="notification is-danger is-light mt-3"
          role="alert"
          data-cy="no-suggestions-message"
          onMouseDown={e => e.preventDefault()}
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
