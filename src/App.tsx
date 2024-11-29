import React, { useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  debounceDelay?: number;
  onSelected?: (person: Person | null) => void;
}

export const App: React.FC<AppProps> = ({
  debounceDelay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selected, setSelected] = useState<Person | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const debouncedApplyQuery = useRef(
    debounce((value: string) => {
      setAppliedQuery(value);
    }, debounceDelay),
  ).current;

  const filteredPeople = useMemo(() => {
    if (!appliedQuery) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
    );
  }, [appliedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (query === inputValue) {
      return;
    }

    setQuery(inputValue);
    setSelected(null);
    onSelected?.(null);

    debouncedApplyQuery(inputValue);
    setIsDropdownVisible(true);
  };

  const handleInputFocus = () => {
    setIsDropdownVisible(true);
    if (!query) {
      setAppliedQuery('');
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsDropdownVisible(false);
    }, 200);
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    setSelected(person);
    onSelected?.(person);
    setIsDropdownVisible(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {/* Title Section */}
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        {/* Search Section */}
        <div className={`dropdown ${isDropdownVisible ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              value={query}
              className="input"
              data-cy="search-input"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          {/* Suggestions List */}
          {isDropdownVisible && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.length > 0 ? (
                  filteredPeople.map(person => (
                    <div
                      key={person.slug}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      onClick={() => handleSuggestionClick(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  ))
                ) : (
                  <div
                    className="notification is-danger is-light mt-3"
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
      </main>
    </div>
  );
};
