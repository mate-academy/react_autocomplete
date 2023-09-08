import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const debounce = (callback: (state: string) => void, delay: number) => {
  let timerId = 0;

  return (...args: string[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(callback, delay, ...args);
  };
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const customDelay = 1000;

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  const selectPerson = (personName: string) => {
    setSelectedPerson(
      peopleFromServer.find(person => {
        return person.name === personName;
      }),
    );

    setAppliedQuery(personName);
  };

  const applyQuery = useCallback(debounce(setAppliedQuery, customDelay), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAppliedQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
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
            value={appliedQuery}
            onChange={handleChange}
            onFocus={() => setIsDropdownVisible(true)}
            onBlur={() => setIsDropdownVisible(false)}
          />
        </div>

        {isDropdownVisible && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length > 0
                ? filteredPeople.map((person: Person) => (
                  <a
                    href="*"
                    className="dropdown-item"
                    onMouseDown={() => {
                      selectPerson(person.name);
                    }}
                    key={person.name}
                  >
                    <p className={classNames('has-text-link', {
                      'has-text-danger': person.sex === 'f',
                    })}
                    >
                      {person.name}
                    </p>
                  </a>
                ))
                : (
                  <div>
                    No matching suggestions
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
