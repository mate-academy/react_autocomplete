import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { SEARCH_DEPLAY } from './utils';

export const App: React.FC = () => {
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const [inputFocus, setInputFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople = useMemo(() => {
    if (!appliedQuery.startsWith(' ')) {
      return peopleFromServer
        .filter(person => person.name.toLowerCase()
          .includes(appliedQuery.toLowerCase()));
    }

    return peopleFromServer;
  }, [appliedQuery]);

  const applyQuery = useCallback(debounce(setAppliedQuery, SEARCH_DEPLAY), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonSelect = (person: Person) => {
    setSelectPerson(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
  };

  return (
    <main className="section">

      <h1 className="title">
        {selectPerson
          ? `${selectPerson.name} (${selectPerson.born} - ${selectPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
          />
        </div>

        {inputFocus
          && (
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-content">
                <div className="dropdown-item">
                  {filteredPeople.length === 0
                    ? (
                      <p>No matching suggestions</p>
                    )
                    : (filteredPeople.map(person => (
                      <p
                        className={cn({
                          'has-text-link': person.sex === 'm',
                          'has-text-danger': person.sex === 'f',
                        })}
                        role="presentation"
                        onMouseDown={() => {
                          handlePersonSelect(person);
                        }}
                      >
                        {person.name}
                      </p>
                    )))}
                </div>
              </div>
            </div>
          )}
      </div>
    </main>
  );
};
