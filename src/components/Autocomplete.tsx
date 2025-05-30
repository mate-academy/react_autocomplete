import React, { useCallback } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  people: Person[];
  query: string;
  setQuery: (value: string) => void;
  setAppliedQuery: (value: string) => void;
  onSelected: (person: Person | null) => void;
  selectedPerson: Person | null;
};

const AutocompleteComponent: React.FC<Props> = ({
  people,
  setQuery,
  query,
  setAppliedQuery,
  onSelected,
  selectedPerson,
}) => {
  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.trimStart());
    applyQuery(event.target.value.trimStart());
    onSelected(null);
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
          onChange={handleQueryChange}
        />
      </div>

      {!selectedPerson && people.length !== 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {people.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => {
                  setQuery(person.name);
                  onSelected(person);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const Autocomplete = React.memo(AutocompleteComponent);
