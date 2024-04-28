import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [onSelected, setOnSelected] = useState<Person | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSelected = (person: Person) => {
    setOnSelected(person);
    setQuery(person.name);
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (!query) {
      setIsOpen(true);
    }
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(people =>
      people.name.toLowerCase().includes(query.toLocaleLowerCase().trim()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {onSelected
            ? `${onSelected.name} (${onSelected.born} - ${onSelected.died})`
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
              onChange={handleChangeQuery}
              onFocus={handleFocus}
            />
          </div>

          {isOpen && filteredPeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(people => (
                  <div
                    className={cn('dropdown-item', {
                      active: onSelected === people,
                    })}
                    data-cy="suggestion-item"
                    key={people.name}
                    onClick={() => handleSelected(people)}
                  >
                    <p
                      className={cn('', {
                        'has-text-link': people.sex === 'm',
                        'has-text-danger': people.sex === 'f',
                      })}
                    >
                      {people.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredPeople.length === 0 && query && (
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
