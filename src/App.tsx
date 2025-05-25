import React, { useState, useRef } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

const preparedList: Person[] = [...peopleFromServer];

export const App: React.FC = () => {
  const [focus, setFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  // const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [title, setTitle] = useState('No selected person');

  const filteredPeople = [...preparedList].filter(person =>
    person.name
      .toLowerCase()
      .replaceAll(' ', '')
      .startsWith(appliedQuery.toLowerCase().replaceAll(' ', '')),
  );

  const handleFocus = () => {
    setFocus(true);
    setTitle('No selected person');
  };

  const timer = useRef(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFocus(true);
    setTitle('No selected person');
    setQuery(event?.target.value);

    clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      setAppliedQuery(event?.target.value);
    }, 1000);
  };

  const handleSelectionChange = (person: Person) => {
    setTitle(`${person.name} (${person.born} - ${person.died})`);
    setFocus(false);
    setQuery('');
    setAppliedQuery('');
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
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
            />
          </div>

          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
            style={{
              display:
                focus === false || filteredPeople.length === 0
                  ? 'none'
                  : 'block',
            }}
          >
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className={'dropdown-item'}
                  data-cy="suggestion-item"
                  key={person.name}
                  onClick={() => handleSelectionChange(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && (
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
