import debounce from 'lodash.debounce';
import cn from 'classnames';

import React, { useMemo, useState } from 'react';
import { Person } from './types/Person';
import './App.scss';
import { peopleFromServer } from './data/people';

const FILTER_DELAY = 1000;

export const App: React.FC = () => {
  const [people] = useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focus, setFocus] = useState(false);

  const filteredPeople: Person[] = useMemo(() => {
    return people
      .filter((person: Person) => {
        const name = person.name.trim().toUpperCase();
        const appliedQueryFiltered = appliedQuery.trim().toUpperCase();

        return name.includes(appliedQueryFiltered);
      });
  }, [appliedQuery, people]);

  const applyQuery = debounce(setAppliedQuery, FILTER_DELAY);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const buttonText = event.currentTarget.textContent || '';

    setQuery(buttonText);
    applyQuery(buttonText);
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
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setFocus(false);
              }, 100);
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
                    <button
                      style={{
                        border: 'none',
                        background: 'none',
                      }}
                      className="has-text-link"
                      type="button"
                      onClick={handlePersonClick}
                    >
                      {name}
                    </button>
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
