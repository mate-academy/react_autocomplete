import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Message } from './components/Message';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [appliedQuery, setAppliedQuery] = useState('');
  const [appliedHuman, setAppliedHuman] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const title = appliedHuman
    ? `${appliedHuman.name} (${appliedHuman.born} - ${appliedHuman.died})`
    : 'No selected person';

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const filteredPeople = useMemo(() => {
    const people = [...peopleFromServer];

    return people.filter(human => human.name.includes(appliedQuery.trim()));
  }, [appliedQuery]);

  const haveMatching = appliedQuery && filteredPeople.length === 0;

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setAppliedHuman(null);
  };

  const handleHumanApplied = (person: Person) => {
    setQuery(person.name);
    applyQuery('');
    setAppliedHuman(person);
    setInputFocused(false);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setInputFocused(false);
    }, 200);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
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
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          {inputFocused && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {haveMatching ? (
                  <Message />
                ) : (
                  filteredPeople.map(human => {
                    return (
                      <PeopleList
                        human={human}
                        humanApplied={handleHumanApplied}
                        key={human.slug}
                      />
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
