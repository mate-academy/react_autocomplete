import React, { useState, useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

interface Person {
  name: string;
  born: number;
  died: number;
  sex: string;
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(false);
  const [selectedPerson, setSelectedPerson] =
    useState<string>('No selected person');

  const applyQuery = () => {
    debounce(() => setSelected(true), 300)();
  };

  const handleQueryChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedPerson('No selected person');
  };

  const filteredPeople = useMemo(() => {
    const normalisedQuery = query.toLowerCase().trim();

    return peopleFromServer.filter(person => {
      const normalisedPerson = person.name.toLowerCase();

      return normalisedPerson.includes(normalisedQuery);
    });
  }, [query]);

  const handlePersonClick = (person: Person) => {
    setQuery(person.name);
    setSelected(false);
    setSelectedPerson(() => {
      return `${person.name} (${person.born} - ${person.died})`;
    });
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              value={query}
              className="input"
              data-cy="search-input"
              onChange={handleQueryChanged}
              onFocus={applyQuery}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {selected && (
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.name}
                    onClick={() => handlePersonClick(person)}
                  >
                    <p
                      className={classNames({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
        </div>
      </main>
    </div>
  );
};
