import React, { useCallback, useState, useEffect } from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type DebounceFunction = (value: string) => void;

function debounce(callback: DebounceFunction, delay: number) {
  let timerId = 0;

  return (value: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(value);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const dropdown = document.querySelector('.dropdown');

      if (dropdown && !dropdown.contains(e.target as Node)) {
        setIsDropdownActive(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const applyFilter = useCallback(
    debounce((value: string) => setAppliedFilter(value), 500),
    [],
  );

  const toggleDropdown = () => {
    setIsDropdownActive(prev => !prev);
    setShowSuggestions(true);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (newValue !== filterValue) {
      setFilterValue(newValue);
      applyFilter(newValue);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (man: Person) => {
    setSelectedPerson(man);
    setFilterValue(man.name);
    applyFilter(man.name);
    setIsDropdownActive(false);
    setShowSuggestions(false);
  };

  const filteredPeople = peopleFromServer.filter(man => man.name
    .toLowerCase().includes(appliedFilter.toLowerCase()));

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedPerson === null
            ? 'No selected person'
            : `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
        }
      </h1>

      <div className={classNames('dropdown', {
        'is-active': isDropdownActive === true,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input "
            onClick={toggleDropdown}
            onChange={handleFilterChange}
            value={filterValue}
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          />
          <span className="icon is-small is-right">
            <i
              className="fas fa-angle-down"
              onClick={toggleDropdown}
              aria-hidden="true"
            />
          </span>
        </div>
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {showSuggestions && (
              filteredPeople.length === 0 ? (
                <div className="dropdown-item">
                  No matching suggestions
                </div>
              ) : (
                filteredPeople.map(man => (
                  <div className="dropdown-item" key={man.slug}>
                    <div
                      onClick={() => handleSuggestionClick(man)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSuggestionClick(man);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className={classNames({
                        'has-text-link': man.sex === 'm',
                        'has-text-danger': man.sex === 'f',
                      })}
                    >
                      {man.name}
                    </div>
                  </div>
                ))
              ))}
          </div>
        </div>
      </div>
    </main>
  );
};
