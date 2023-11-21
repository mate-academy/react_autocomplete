import debounce from 'lodash.debounce';
import cn from 'classnames';

import React, { useCallback, useMemo, useState } from 'react';
import { Person } from './types/Person';
import './App.scss';
import { peopleFromServer } from './data/people';

const FILTER_DELAY = 300;

export const App: React.FC = () => {
  const [people] = useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(false);

  const filteredPeople: Person[] = useMemo(() => {
    return people
      .filter((person: Person) => {
        const name = person.name.trim().toUpperCase();
        const appliedQuery = query.trim().toUpperCase();

        return name.includes(appliedQuery);
      });
  }, [query, people]);

  const applyQuery = useCallback(debounce(setQuery, FILTER_DELAY), []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    applyQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {filteredPeople.length
          ? `${filteredPeople[0].name} (${filteredPeople[0].born} = ${filteredPeople[0].died})`
          : 'No matching suggestions'}
      </h1>

      <div className={cn('dropdown', {
        'is-active': focus,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleInputChange}
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => {
              setFocus(false);
            }}
          />
        </div>

        {filteredPeople.length > 0 && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.map(person => {
                const { slug, name } = person;

                return (
                  <div className="dropdown-item" key={slug}>
                    <p className="has-text-link">{name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
