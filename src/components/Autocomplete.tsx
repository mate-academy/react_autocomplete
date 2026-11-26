import { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import cn from 'classnames';

interface Props {
  peoples: Person[];
  onSelected: (person: Person) => void;
  query: string;
  onQueryChange: (query: string) => void;
  debounceDelay: number;
}

const Autocomplete: React.FC<Props> = ({
  peoples,
  onSelected,
  query,
  onQueryChange,
  debounceDelay = 300,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const filteredPeoples = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return peoples;
    }

    return peoples.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [peoples, debouncedQuery]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceDelay);

    return () => {
      clearTimeout(timerId);
    };
  }, [query, debounceDelay, debouncedQuery]);

  const handleSelect = (person: Person) => {
    onSelected(person);
    onQueryChange(person.name);
    setIsOpen(false);
  };

  const handleInputOnFocus = () => {
    setIsOpen(true);
  };

  const handleinputBlur = () => {
    setTimeout(() => setIsOpen(false), 500);
  };

  const showNoResults = isOpen && query && filteredPeoples.length === 0;

  return (
    <div className="Autocomplete-wrapper is-align-self-flex-start is-relative">
      <div className={cn('dropdown', { 'is-active': isOpen })}>
        <div className="dropdown-trigger">
          <input
            value={query}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onFocus={handleInputOnFocus}
            onChange={event => onQueryChange(event.target.value)}
            onBlur={handleinputBlur}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeoples.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
              >
                <p
                  className="has-text-link"
                  onClick={() => handleSelect(person)}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showNoResults && (
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
    </div>
  );
};

export default Autocomplete;
