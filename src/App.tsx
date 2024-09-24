import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(people =>
      people.name.includes(appliedQuery),
    );
  }, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    applyQuery(newValue);
    setValue(newValue);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson?.name === value
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': selectedPerson?.name !== value,
          })}
        >
          <div className="dropdown-trigger">
            <input
              autoFocus
              type="text"
              value={value}
              onChange={event => {
                handleQueryChange(event);
              }}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(people => (
                <div
                  key={people.name}
                  onClick={() => {
                    setSelectedPerson(people);
                    setValue(people.name);
                  }}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                >
                  <p
                    className={classNames({
                      'has-text-danger': people.sex === 'f',
                      'has-text-link': people.sex === 'm',
                    })}
                  >
                    {people.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && (
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
