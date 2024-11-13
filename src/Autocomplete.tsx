import { useEffect, useState } from 'react';
import { Person } from './types/Person';

interface AutocompleteProps {
  people: Person[];
  query: string;
  setQuery: (query: string) => void;
  onSelected: (person: Person) => void;
  onQueryChange: (query: string) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({ people, query, setQuery, onSelected, onQueryChange }) => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  useEffect(() => {
    setIsDropdownActive(query === '' || people.length > 0);
  }, [query, people]);

  return (
    <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onQueryChange(e.target.value);
              }}
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {people.length === 0 && query && (
                <div className="dropdown-item has-text-centered">No matching suggestions</div>
              )}
              {people.map(person => (
                <div className="dropdown-item" data-cy="suggestion-item" key={person.slug} onClick={() => onSelected(person)}>
                <p className="has-text-link">{person.name}</p>
              </div>
              ))}
            </div>
          </div>
        </div>
  )
}
