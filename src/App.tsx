import React, {
  useCallback, useState,
} from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [apliedQuery, setApliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useCallback(debounce(setApliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = React.useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(apliedQuery.toLowerCase()));
  }, [apliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">

        <h1 className="title" data-cy="title">
          {
            (selectedPerson !== null)
              ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
              : 'No selected person'
          }
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              value={query}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleQueryChange}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setIsFocused(false);
                }, 10);
              }}
            />
          </div>

          {
            isFocused &&
        (
          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >

            <div className="dropdown-content">

              {
                filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.name}
                  >
                    <p
                      className="has-text-link"
                      onClick={() => {
                        setQuery(person.name);
                        setSelectedPerson(person);
                        }}
                    >
                      {person.name}
                    </p>
                  </div>
                ))
              }

            </div>
          </div>
        )
          }
        </div>

        {
          (!selectedPerson && filteredPeople.length === 0) &&

                  (
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
                  )
        }
      </main>
    </div>
  );
};
