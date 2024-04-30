import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import debounce from 'lodash.debounce';
import cn from 'classnames';

import { Person } from '../../types/Person';
import './Dropdown.scss';

type Props = {
  people: Person[];
  delay?: number;
  onSelect: (person: Person | null) => void;
};

export const Dropdown: React.FC<Props> = ({
  people,
  delay = 300,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const debouncedApplyQuery = useRef(
    debounce((value: string) => {
      setAppliedQuery(value);
      onSelect(null);
    }, delay),
  );

  const applyQuery = useCallback(
    (value: string) => {
      debouncedApplyQuery.current(value);
    },
    [debouncedApplyQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsDropdownVisible(true);
  };

  const filteredPeople = useMemo(() => {
    if (query === '') {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery, query]);

  const handleSelectPerson = (person: Person) => {
    onSelect(person);
    setQuery('');
    setIsDropdownVisible(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={cn('dropdown', {
        'is-active': isDropdownVisible,
      })}
      ref={dropdownRef}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsDropdownVisible(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.length > 0 ? (
            filteredPeople.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
                data-cy="suggestion-item"
                onClick={() => handleSelectPerson(person)}
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
    </div>
  );
};
