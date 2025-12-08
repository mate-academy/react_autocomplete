import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../../types/Person';

type Props = {
  peopleData: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
  selectedPerson?: Person | null;
};

export const PeopleSearch: React.FC<Props> = ({
  peopleData,
  delay = 300,
  onSelected,
  selectedPerson,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);

    if (selectedPerson && value !== selectedPerson.name) {
      onSelected(null);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedQuery !== query.trim().toLowerCase()) {
        setDebouncedQuery(query.trim().toLowerCase());
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delay, debouncedQuery]);

  const people = [...peopleData].sort((a, b) => a.name.localeCompare(b.name));

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(debouncedQuery),
    );
  }, [debouncedQuery, people]);

  const visiblePeople = debouncedQuery === '' ? people : filteredPeople;

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsFocused(false);
  };

  return (
    <>
      <div className={classNames('dropdown', { 'is-active': isFocused })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            data-cy="search-input"
          />
        </div>

        {isFocused && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {visiblePeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => handleSelect(person)}
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
      </div>

      {filteredPeople.length === 0 && selectedPerson === null && isFocused && (
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
