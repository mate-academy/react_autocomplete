import React, { useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [appliedTitle, setAppliedTitle] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const timerId = useRef(0);
  const delay = 300;

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setTitle(value);

    window.clearTimeout(timerId.current);
    timerId.current = window.setTimeout(() => {
      setAppliedTitle(value);
      setSelectedPerson(null);
    }, delay);
  };

  const handlePersonMouseDown = (person: Person) => {
    setTitle(person.name);
    setAppliedTitle(person.name);
    setSelectedPerson(person);
    setIsFocused(false);
  };

  const handleTitleBlur = () => {
    setIsFocused(false);

    if (!selectedPerson) {
      setTitle('');
    }
  };

  const shouldShowAll = isFocused && title.trim() === '';
  const query = appliedTitle.toLowerCase().trim();

  let filteredPeople: Person[] = [];

  if (shouldShowAll) {
    filteredPeople = peopleFromServer;
  } else {
    filteredPeople = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(query),
    );
  }

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': isFocused,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={title}
              onChange={handleTitleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={handleTitleBlur}
            />
          </div>

          {isFocused && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.length > 0 ? (
                  filteredPeople.map(person => (
                    <div
                      className="dropdown-item"
                      data-cy="suggestion-item"
                      key={person.slug}
                      onMouseDown={() => handlePersonMouseDown(person)}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  ))
                ) : (
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
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
