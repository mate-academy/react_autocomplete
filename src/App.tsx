import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const preparePeopleList = (people: Person[], query: string | number) => {
  const normalizedQuery = String(query).toLowerCase().trim();

  return people.filter(({ name }) => {
    const normalizedName = name.toLowerCase();

    return normalizedName.includes(normalizedQuery);
  });
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const peopleList = preparePeopleList(peopleFromServer, debouncedQuery);

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
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
              onChange={event => {
                setQuery(event.target.value.trimStart());
                setSelectedPerson(null);
              }}
              onFocus={() => setIsInputFocused(true)}
            />
          </div>

          {isInputFocused && !selectedPerson && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {peopleList.map(person => {
                  const isPersonMale = person.sex === 'm';

                  return (
                    <div
                      key={person.slug}
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      onClick={() => handleSelectPerson(person)}
                    >
                      <p
                        className={cn(
                          { 'has-text-link': isPersonMale },
                          { 'has-text-danger': !isPersonMale },
                        )}
                      >
                        {person.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {isInputFocused && !selectedPerson && !peopleList.length && (
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
      </main>
    </div>
  );
};
