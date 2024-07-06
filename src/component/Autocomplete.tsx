import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';

// import { debounce } from 'lodash';
// import { v4 as uuidv4 } from 'uuid';
import { Person } from '../types/Person';

type Props = {
  peoples: Person[];
  handlePeople: (name: Person | null) => void;
  debounceDelay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  peoples,
  handlePeople,
  debounceDelay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [defaultPlaceHolder, setDefaultPlaceHolder] = useState(
    'Enter a part of the name',
  );

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setQuery(value), debounceDelay),
    [debounceDelay],
  );

  const filteredPeople = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return peoples.filter(person =>
      person.name.toLowerCase().trim(normalizedQuery),
    );
  }, [query, peoples]);

  const handleQueryUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    debouncedSetQuery(value);

    if (selectedPerson) {
      setDefaultPlaceHolder('No selected person');
      setSelectedPerson(null);
      handlePeople(null);
    }
  };

  const handlePeopleName = (person: Person) => {
    setDefaultPlaceHolder(person.name);
    setSelectedPerson(person);
    handlePeople(person);
    setIsFocused(false);
  };

  const toggleList = useCallback(() => {
    setIsFocused(true);
  }, []);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  return (
    <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder={defaultPlaceHolder}
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryUsers}
          onFocus={toggleList}
        />
      </div>
      {isFocused && (
        <div
          className="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
          ref={dropdownRef}
        >
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map((person: Person) => (
                <div
                  key={uuidv4()}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handlePeopleName(person)}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
