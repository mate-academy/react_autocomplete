import cn from 'classnames';
import debounce from 'lodash.debounce';

import React, { useState, useCallback, useMemo, useEffect } from 'react';

import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
  onChange: () => void;
  delay: number;
};

const AutocompleteComponent = ({
  people,
  onSelect = () => {},
  onChange = () => {},
  delay = 300,
}: Props) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [suggestions, setSuggestions] = useState(people);
  const [isOpen, setIsOpen] = useState(false);

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange();
      setQuery(event.target.value);

      const newValue = event.target.value;

      if (newValue === query) {
        return;
      }

      if (newValue.trim() === '' && newValue !== '') {
        return;
      }

      applyQuery(event.target.value);
    },
    [query, applyQuery, onChange],
  );

  const handleSelect = useCallback(
    (person: Person) => {
      setQuery(person.name);
      setAppliedQuery(person.name);
      setIsOpen(false);
      onSelect(person);
    },
    [onSelect],
  );

  useEffect(() => {
    if (appliedQuery.trim() === '') {
      setSuggestions(people);
    } else {
      const filteredPeople = people.filter(person =>
        person.name
          .toLocaleLowerCase()
          .includes(appliedQuery.toLocaleLowerCase()),
      );

      setSuggestions(filteredPeople);
    }
  }, [appliedQuery, people]);

  return (
    <>
      <div className={cn('dropdown', { 'is-active': isOpen })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {suggestions.length === 0 && query.trim() !== '' && (
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

export const Autocomplete = React.memo(AutocompleteComponent);
