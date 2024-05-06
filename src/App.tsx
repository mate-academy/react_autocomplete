import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import cn from 'classnames';

const DELAY = 300;

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [suggest, setSuggest] = useState<Person[]>(peopleFromServer);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setPerson(null);
    setDropDownOpen(true);
    setQuery(newQuery);

    setTimeout(() => {
      const filtered = peopleFromServer.filter(pers =>
        pers.name.toLowerCase().includes(newQuery.toLowerCase()),
      );

      setSuggest(filtered);
    }, DELAY);
  };

  const handleItemClick = (item: Person) => {
    setPerson(item);
    setDropDownOpen(false);
    setQuery(item?.name);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {person
            ? `${person?.name} (${person?.born} - ${person?.died})`
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
              onChange={handleQueryChange}
              onFocus={() => setDropDownOpen(true)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {suggest.length > 0 && dropDownOpen && (
              <div className="dropdown-content">
                {suggest.map(item => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={item.slug}
                    onClick={() => handleItemClick(item)}
                  >
                    <p
                      className={cn({
                        'has-text-link': item.sex === 'm',
                        'has-text-danger': item.sex === 'f',
                      })}
                    >
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {suggest.length === 0 && (
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
