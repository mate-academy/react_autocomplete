import React, { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const filteredPeople = useMemo(() => {
    const normalisedQuery = query.toLowerCase().trim();

    return peopleFromServer.filter(person => {
      const normalisedPerson = person.name.toLowerCase();

      return normalisedPerson.includes(normalisedQuery);
    });
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedPerson(null);
    setIsDropdownActive(!!event.target.value || event.type === 'focus');
    debounce(() => setIsDropdownActive(true), 300)();
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsDropdownActive(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputChange}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {isDropdownActive && (
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.name}
                    role="menuitem"
                    tabIndex={0}
                    onClick={() => handleSuggestionClick(person)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSuggestionClick(person);
                      }
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
                {!filteredPeople.length && (
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
