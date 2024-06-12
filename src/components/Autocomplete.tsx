import React, { useState, useMemo, useEffect } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '.././data/people';

type Props = {
  onSelectPerson: (person: Person) => void;
  clearPerson: () => void;
};

export const Autocomplete: React.FC<Props> = ({
  onSelectPerson,
  clearPerson,
}) => {
  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [inputFocused, setInputFocused] = useState(false);

  const debouncedFilter = useMemo(
    () =>
      debounce((value: string) => {
        const filtered = value
          ? peopleFromServer.filter(person => person.name.includes(value))
          : peopleFromServer;

        setFilteredPeople(filtered);
      }, 300),
    [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    debouncedFilter(event.target.value);
    clearPerson();
  };

  const handleSelectedPerson = (person: Person) => {
    setQuery(person.name);
    onSelectPerson(person);
    setFilteredPeople([]);
    setInputFocused(false);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
    if (!query) {
      setFilteredPeople(peopleFromServer);
    }
  };

  useEffect(() => {
    setFilteredPeople(peopleFromServer);
  }, []);

  return (
    <div className={`dropdown ${inputFocused ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
      </div>

      {inputFocused && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map((person, index) => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={index}
                  onClick={() => handleSelectedPerson(person)}
                >
                  <p>{person.name}</p>
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

export default Autocomplete;
