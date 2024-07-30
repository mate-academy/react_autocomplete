import { useEffect, useMemo, useRef, useState } from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

interface Props {
  onSelect: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  onSelect = () => {},
  delay = 300,
}) => {
  const [list, setList] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => setList(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [delay, query]);

  const filteredPersons = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [debouncedQuery]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelect(null);
  };

  const handlePersonClick = (person: Person) => {
    onSelect(person);
    setList(false);
    setQuery(person.name);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onFocus={handleFocus}
          onChange={changeHandler}
        />
      </div>

      {list && (
        <div
          ref={dropdownRef}
          className="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
        >
          <div className="dropdown-content">
            {filteredPersons.length ? (
              filteredPersons.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  style={{ cursor: 'pointer' }}
                  data-cy="suggestion-item"
                  onClick={() => handlePersonClick(person)}
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
