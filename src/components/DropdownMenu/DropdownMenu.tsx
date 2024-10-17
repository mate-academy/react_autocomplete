import debounce from 'lodash.debounce';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Person } from '../../types/Person';
import cn from 'classnames';

interface Props {
  people: Person[];
  onSelectedPerson: (person: Person | null) => void;
  delay?: number;
}

export const DropdownMenu: React.FC<Props> = ({
  people,
  onSelectedPerson,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const applyQuery = useCallback(
    debounce(string => {
      setFilterQuery(string);
    }, delay),
    [],
  );

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setQuery(event.target.value);
    onSelectedPerson(null);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name
        .toLocaleLowerCase()
        .includes(filterQuery.trim().toLowerCase()),
    );
  }, [filterQuery, people]);

  const anyPersonFound = filteredPeople.length !== 0;

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setActiveDropdown(false);
      onSelectedPerson(null);
      setQuery('');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={cn('dropdown', { 'is-active': activeDropdown })}
        role="menu"
        ref={dropdownRef}
      >
        <div className="dropdown-trigger">
          <input
            onFocus={() => setActiveDropdown(true)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInput}
          />
        </div>

        {anyPersonFound && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  style={{ cursor: 'pointer' }}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => onSelectedPerson(person)}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!anyPersonFound && (
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
