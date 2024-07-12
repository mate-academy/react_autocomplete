import React, { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dropDown, setDropDown] = useState(false);

  const applyQuery = useMemo(
    () => debounce(setAppliedQuery, 300),
    [setAppliedQuery],
  );

  const filteredPerson = useMemo(() => {
    if (appliedQuery) {
      return peopleFromServer.filter(person =>
        person.name.includes(appliedQuery),
      );
    }

    return peopleFromServer;
  }, [appliedQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPerson) {
      setQuery(event.target.value.trim());
      applyQuery(event.target.value.trim());
    }

    setSelectedPerson(null);
  };

  const handleSuggestionSelect = (person: Person) => {
    setQuery(person.name);
    applyQuery(person.name);
    setSelectedPerson(person);
    setDropDown(false);
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
              onFocus={() => setDropDown(true)}
            />
          </div>

          {dropDown && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPerson.length > 0 ? (
                  filteredPerson.map(person => (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.slug}
                      onClick={() => handleSuggestionSelect(person)}
                    >
                      <p
                        className={
                          person.sex === 'm'
                            ? 'has-text-link'
                            : 'has-text-danger'
                        }
                      >
                        {person.name}
                      </p>
                    </div>
                  ))
                ) : (
                  <div
                    className="notification
                    is-danger is-light
                    mt-3
                    is-align-self-flex-start"
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
