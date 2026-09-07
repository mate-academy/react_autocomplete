import React, { useCallback, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

interface AutocompleteProps {
  people: Person[];
  delay: number;
  onSelect: (person: Person | null) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = props => {
  const { people, delay, onSelect } = props;

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);

  const debouncedRef = useRef(debounce(setAppliedQuery, delay));

  const applyQuery = useCallback((value: string) => {
    debouncedRef.current(value);
  }, []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);
    applyQuery(newQuery);
    onSelect(null);
  };

  const filteredPeople = useMemo(() => {
    if (appliedQuery === '') {
      return people;
    }

    if (!appliedQuery.trim()) {
      return [];
    }

    const normalizedQuery = appliedQuery.trim().toLowerCase();

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, appliedQuery]);

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsListVisible(false);
    onSelect(person);
  };

  return (
    <div className={cn('dropdown', { 'is-active': isListVisible })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsListVisible(true)}
          onBlur={() => setIsListVisible(false)}
        />
      </div>

      {isListVisible && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onMouseDown={() => handleSelect(person)}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))
            ) : (
              <div
                // eslint-disable-next-line max-len
                className="notification is-danger is-light mt-3 is-align-self-flex-start"
                role="alert"
                data-cy="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
