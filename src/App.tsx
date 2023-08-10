import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [people, setPeople] = useState(peopleFromServer);
  const [inputValue, setInputValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isTriggered, setIsTriggered] = useState(false);
  const { name, born, died } = selectedPerson || {};

  const debouncedHandleInputChange = useCallback(
    debounce((newInputValue: string) => {
      const filteredPeoples = people.filter(
        person => person.name.toLowerCase().includes(
          newInputValue.toLowerCase(),
        ),
      );

      setPeople(filteredPeoples);
    }, 1000), [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    debouncedHandleInputChange(event.target.value);
  };

  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    setInputValue(person.name);
    setIsTriggered(false);
  };

  const inputOnClick = () => {
    setInputValue('');
    setSelectedPerson(null);
    setPeople(peopleFromServer);
  };

  const handlePressEnter = (person: Person) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${name} (${born} - ${died})` : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsTriggered(true)}
            onClick={inputOnClick}
          />
        </div>

        {isTriggered && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {people.length === 0 ? (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              ) : (
                people.map(person => {
                  const personClass = classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  });

                  return (
                    <div
                      className="dropdown-item"
                      role="menuitem"
                      key={person.slug}
                      onClick={() => selectPerson(person)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handlePressEnter(person);
                        }
                      }}
                      tabIndex={0}
                    >
                      <p className={personClass}>{person.name}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
