import React, { useCallback, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList/PeopleList';

interface Props {
  debounceTimeout?: number;
}

export const App: React.FC<Props> = ({ debounceTimeout = 300 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const applyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value), debounceTimeout),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  // eslint-disable-next-line
  const filteredPerson = peopleFromServer.filter(person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()));

  const dropdownActive = query !== '' || isInputFocused;

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  const handlePersonSelect = (person: Person) => {
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

        <div className={`dropdown ${dropdownActive ? 'is-active' : ''}`}>
          <div className="dropdown-trigger control has-icons-right">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={selectedPerson ? selectedPerson.name : query}
              onChange={handleQueryChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            {selectedPerson && (
              <span className="icon is-small is-right">
                <button
                  onClick={() => {
                    setQuery('');
                    setAppliedQuery('');
                    setSelectedPerson(null);
                  }}
                  type="button"
                  className="delete is-small"
                >
                  x
                </button>
              </span>
            )}
          </div>

          <PeopleList
            people={filteredPerson}
            onSelectPerson={handlePersonSelect}
          />
        </div>

        {appliedQuery !== '' && filteredPerson.length === 0 && (
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
