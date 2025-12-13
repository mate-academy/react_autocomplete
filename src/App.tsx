import React, { useMemo, useState } from 'react';
import './App.scss';
import 'bulma/css/bulma.min.css';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const persons = peopleFromServer;
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showField, setShowField] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const debouncedApplyQuery = useMemo(() => debounce(setAppliedQuery, 300), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    debouncedApplyQuery(value);
    setSelectedPerson(null);
  };

  const visiblePersons = persons.filter(person =>
    person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <Autocomplete person={selectedPerson} />

        <div
          className={classNames('dropdown', {
            'is-active': showField && visiblePersons.length > 0,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              className="input"
              placeholder="Enter a part of the name"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setShowField(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {visiblePersons.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => {
                    setSelectedPerson(person);
                    setShowField(false);
                    setQuery('');
                  }}
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
          </div>
        </div>

        {showField && visiblePersons.length === 0 && (
          <div
            className="notification
            is-danger is-light mt-3 is-align-self-flex-start"
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
