import React, { useState, useCallback, useRef } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  debounceTime: number;
};

export const App: React.FC<Props> = ({ debounceTime = 300 }) => {
  const [query, setQuery] = useState('');
  const [peopleFiltered, setPeopleFiltered] =
    useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const debounce = useCallback(
    (func: (...args: string[]) => void, delay: number) => {
      let timer: NodeJS.Timeout;

      return (...args: string[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
      };
    },
    [],
  );

  const filterPeople = useCallback((text: string) => {
    if (text.trim() === '') {
      setPeopleFiltered(peopleFromServer);
    } else {
      setPeopleFiltered(
        peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    }
  }, []);

  const debouncedFilter = useCallback(debounce(filterPeople, debounceTime), [
    filterPeople,
  ]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    setIsDropdownOpen(true);

    if (selectedPerson) {
      setSelectedPerson(null);
    }

    debouncedFilter(value);
  };

  const hideDropdown = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsDropdownOpen(false);
      }
    }, 200);
  };

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsDropdownOpen(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}
          ref={dropdownRef}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={hideDropdown}
            />
          </div>

          {isDropdownOpen && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {peopleFiltered.length > 0 ? (
                  peopleFiltered.map(person => (
                    <div
                      key={person.name}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      onMouseDown={() => handleSelectPerson(person)}
                    >
                      <p
                        className={
                          person.sex === 'm'
                            ? 'has-text-primary'
                            : 'has-text-danger'
                        }
                      >
                        {person.name}
                      </p>
                    </div>
                  ))
                ) : (
                  <div
                    className="dropdown-item has-text-danger"
                    data-cy="no-suggestions-message"
                  >
                    No matching suggestions
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
