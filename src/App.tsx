import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { debounce } from './serveses/debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [visbleList, setVisibleList] = useState(false);

  const listNamesPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person
        .name.toLowerCase().includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  const chouseListNames = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setVisibleList(false);
  };

  const applyQuery = useMemo(() => (
    debounce(setAppliedQuery, 300)
  ), []);

  const handleQueryCgange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryCgange}
              onFocus={() => setVisibleList(true)}
            />
          </div>

          <div
            className={cn(
              'dropdown-menu',
              { 'is-hidden': listNamesPeople.length === 0 },
            )}
            role="menu"
            data-cy="suggestions-list"
          >
            {visbleList && (
              <ul className="dropdown-content">
                {listNamesPeople.map(person => {
                  return (
                    <li
                      data-cy="suggestion-item"
                      key={person.slug}
                      className="dropdown-item"
                    >
                      <button
                        type="button"
                        className="button is-link is-light"
                        onClick={() => chouseListNames(person)}
                      >
                        {person.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

          </div>
        </div>

        {listNamesPeople.length === 0 && (
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
