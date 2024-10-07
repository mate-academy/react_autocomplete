import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<number | undefined>(
    undefined,
  );
  const [filterValue, setFilterValue] = useState('');

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
    setFilterValue(person ? person.name : '');
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setFilterValue(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {}, 300);

    setTypingTimeout(newTimeout);

    if (selectedPerson && value) {
      setSelectedPerson(null);
    }
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(user =>
      user.name.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }, [filterValue]);

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
              onChange={handleChangeText}
              value={filterValue}
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length !== 0 &&
                !selectedPerson &&
                filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSelectedPerson(person)}
                    key={person.slug}
                  >
                    <p
                      className={classNames({
                        'has-text-danger': person.sex === 'f',
                        'has-text-link': person.sex === 'm',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              {filteredPeople.length === 0 && (
                <div className="dropdown-item" data-cy="no-suggestions-message">
                  <p>No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
