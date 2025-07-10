import React from 'react';
import { useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [onSelected, setOnSelected] = useState<Person | null>(null);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const filteredPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleFocus = () => {
    setIsDropdownVisible(true);
  };

  const handleBlur = () => {
    setIsDropdownVisible(false);
  };

  const handleClick = (person: Person) => {
    setQuery(person.name);
    setIsDropdownVisible(false);
    setOnSelected(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {onSelected && onSelected.name === query ? (
          <h1 className="title" data-cy="title">
            {`${onSelected.name} (${onSelected.born} - ${onSelected.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className={cn('dropdown', { 'is-active': isDropdownVisible })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onMouseDown={() => handleClick(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!filteredPeople.length && (
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
