import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

interface Props {
  people: Person[];
  onSelect: (person: Person | null) => void;
  debounceDelay?: number;
}
export const Autocomplete: React.FC<Props> = ({
  onSelect,
  people,
  debounceDelay = 300,
}) => {
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [inputFocused, setInputFocused] = useState(false);
  const [query, setQuery] = useState<string>('');

  const applyQuery = useCallback(debounce(setAppliedQuery, debounceDelay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    if (!inputFocused) {
      return [];
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people, inputFocused]);

  const handleFocusedInput = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocusedInput}
            onBlur={handleBlur}
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(filteredPerson => (
              <div
                key={filteredPerson.name}
                onClick={() => onSelect(filteredPerson)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    onSelect(filteredPerson);
                  }
                }}
                role="button"
                tabIndex={0}
                className="dropdown-item"
                data-cy="suggestion-item"
              >
                <p className="has-text-link">{filteredPerson.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredPeople.length === 0 && inputFocused && (
        <div
          className="
          notification
          is-danger
          is-light
          mt-3
          is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
