import React, { useState, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [focusInput, setFocusInput] = useState<boolean>(false);

  const people = peopleFromServer;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: string = event.target.value;

    setInputValue(newValue);

    if (!newValue) {
      setSelectPerson(null);
    }
  };

  const handlePersonClick = useCallback((selectedPerson: Person) => {
    setSelectPerson(selectedPerson);
    setInputValue(selectedPerson.name);
    setFocusInput(false);
  }, []);

  const filteredPerson = people.filter((person) => {
    return person.name.toLowerCase().includes(inputValue.toLowerCase());
  });
  const title = selectPerson ? `${selectPerson.name} (${selectPerson.born} - ${selectPerson.died})` : 'No matching suggestions';

  const handleDelete = () => {
    setInputValue('');
    setSelectPerson(null);
  };

  return (
    <main className="section">
      <h1 className="title">
        {!inputValue ? 'Сhoose a name' : title}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            onChange={handleChange}
            value={inputValue}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onFocus={() => setFocusInput(true)}
          />
          {
            inputValue
            && (
              <button
                type="button"
                className="delete"
                onClick={handleDelete}
                aria-label="Clear input"
              />
            )
          }
        </div>

        {focusInput
          && (
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-content">
                <div className="dropdown-item">
                  {inputValue ? (
                    filteredPerson.map((person) => (
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
                      <p
                        key={person.name}
                        className="has-text-link"
                        onClick={() => handlePersonClick(person)}
                      >
                        {person.name}
                      </p>
                    ))
                  ) : (
                    peopleFromServer.map((person) => (
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
                      <p
                        key={person.name}
                        className="has-text-link"
                        onClick={() => handlePersonClick(person)}
                      >
                        {person.name}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
      </div>
    </main>
  );
};
