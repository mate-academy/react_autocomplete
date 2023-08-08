import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [peoples, setPeoples] = useState(peopleFromServer);
  const [inputValue, setInputValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};
  const [trigger, setTrigger] = useState(false);

  const debouncedHandleInputChange = useCallback(
    debounce((newInputValue: string) => {
      const filteredPeoples = peoples.filter(
        person => person.name.toLowerCase().includes(
          newInputValue.toLowerCase(),
        ),
      );

      setPeoples(filteredPeoples);
    }, 1000), [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    debouncedHandleInputChange(event.target.value);
  };

  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    setInputValue(person.name);
    setTrigger(false);
  };

  const inputOnClick = () => {
    setInputValue('');
    setSelectedPerson(null);
    setPeoples(peopleFromServer);
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
            onFocus={() => setTrigger(true)}
            onClick={inputOnClick}
          />
        </div>

        {trigger && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {peoples.length === 0 ? (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              ) : (
                peoples.map(person => {
                  const personClass = person.sex === 'm'
                    ? 'has-text-link' : 'has-text-danger';

                  return (
                    <div
                      className="dropdown-item"
                      role="menuitem"
                      key={person.slug}
                      onClick={() => selectPerson(person)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          setSelectedPerson(person);
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
