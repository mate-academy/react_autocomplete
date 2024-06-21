import React, { useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';
import cn from 'classnames';
import debounce from 'lodash.debounce';

type Props = {
  persons: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const DropDownMenu: React.FC<Props> = ({
  persons,
  onSelected,
  delay = 300,
}) => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const applyQuery = debounce((value: string) => {
    setAppliedQuery(value);
    setFocused(true);
  }, delay);

  const handlePersonChange = (selectedPerson: Person) => {
    setQuery(selectedPerson.name);
    onSelected(selectedPerson);
    setFocused(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    onSelected(null);
    setFocused(false);
  };

  const filteredPersons = useMemo(() => {
    return persons.filter(person =>
      person.name
        .toLowerCase()
        .trim()
        .includes(appliedQuery.trim().toLowerCase()),
    );
  }, [appliedQuery, persons]);

  return (
    <div className={cn('dropdown', { 'is-active': focused })}>
      <div className="dropdown-trigger">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onFocus={() => setFocused(true)}
          onChange={handleQueryChange}
        />
      </div>

      {focused && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPersons.length > 0 ? (
              filteredPersons.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item is-clickable"
                  data-cy="suggestion-item"
                  onClick={() => handlePersonChange(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
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
      )}
    </div>
  );
};
