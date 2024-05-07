import React, { useCallback, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(true);
  const [title, setTitle] = useState<Person | null>(null);

  const filteredPeople = [...peopleFromServer].filter(person => {
    const prettyQuery = appliedQuery.toLowerCase().trimStart();

    return person.name.toLowerCase().includes(prettyQuery);
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setShowDropdown(true);
    setTitle(null);
  };

  const hasPeople = filteredPeople.length > 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title
            ? `${title.name} (${title.born} - ${title.died})`
            : `No selected person`}
        </h1>
        <div
          className={cn('dropdown', {
            'is-active': hasPeople && showDropdown,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => {
                    setShowDropdown(false);
                    setQuery(person.name);
                    setTitle(person);
                  }}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!hasPeople && (
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
