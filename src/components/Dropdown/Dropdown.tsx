import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person | null) => void;
  debounceDelay?: number;
};

export const Dropdown: React.FC<Props> = ({
  people,
  onSelect,
  debounceDelay = 300,
}) => {
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [isDropdownActive, setIsDropdownActive] = React.useState(false);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim() === '') {
        setDebouncedQuery('');

        return;
      }

      setDebouncedQuery(query);
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [query, debounceDelay]);

  const filteredPeople = React.useMemo(() => {
    return people.filter(person =>
      person.name.toLocaleLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [people, debouncedQuery]);

  const hasResults = filteredPeople.length > 0;
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    onSelect(null);
    setQuery(event.target.value);
    setIsDropdownActive(true);
  }

  function handleSelect(person: Person) {
    onSelect(person);
    setIsDropdownActive(false);
    setQuery(person.name);
  }

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownActive(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsDropdownActive(true)}
          />
        </div>

        {isDropdownActive && hasResults && (
          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
            ref={dropdownRef}
          >
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!hasResults && (
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
