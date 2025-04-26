import { useEffect, useMemo, useRef, useState } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  peopleFromServer: Person[];
  debounceDelay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  peopleFromServer,
  debounceDelay = 300,
  onSelected,
}) => {
  const [people, setPeople] = useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debouncedSetAppliedQuery = useMemo(
    () => debounce(setAppliedQuery, debounceDelay),
    [debounceDelay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null);
    debouncedSetAppliedQuery(event.target.value);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPeople(
      peopleFromServer.filter(person =>
        person.name
          .toLocaleLowerCase()
          .includes(appliedQuery.toLocaleLowerCase()),
      ),
    );
  }, [appliedQuery, peopleFromServer]);

  const handleFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleClick = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    onSelected(person);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

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
            onChange={handleQueryChange}
            onFocus={handleFocus}
          />
        </div>

        {people.length !== 0 && isDropdownOpen && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {people.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item"
                  style={{ cursor: 'pointer' }}
                  data-cy="suggestion-item"
                  onClick={() => handleClick(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!people.length && (
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
