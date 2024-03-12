import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const notSelectedPerson: Person = {
    name: '',
    sex: 'm',
    born: 0,
    died: 0,
    fatherName: '',
    motherName: '',
    slug: '',
  };
  const [onSelected, setOnSelected] = useState(notSelectedPerson);
  const { name, born, died } = onSelected;
  const [isShowed, setIsShowed] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [instantInoutValue, setInstantInoutValue] = useState('');
  const [delay] = useState(300);

  const applyCurrentInput = useCallback(debounce(setCurrentInput, delay), []);

  const handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyCurrentInput(event.target.value);
    setInstantInoutValue(event.target.value);
    setOnSelected(notSelectedPerson);
  };

  const handleSelectedPerson = (person: Person) => {
    setInstantInoutValue(person.name);
    setOnSelected(person);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(currentInput.toLowerCase()),
    );
  }, [currentInput]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {name === '' ? 'No selected person' : `${name} (${born} - ${died})`}
        </h1>

        <div className={classNames('dropdown', isShowed && 'is-active')}>
          <div className="dropdown-trigger">
            <input
              value={instantInoutValue}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleInputValue}
              onFocus={() => setIsShowed(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsShowed(false);
                }, 100);
              }}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  data-person={person}
                  onClick={() => handleSelectedPerson(person)}
                  aria-hidden="true"
                  style={{ cursor: 'pointer' }}
                >
                  <p
                    className={
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

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
          <p className="has-text-danger">
            {filteredPeople.length === 0 && 'No matching suggestions'}
          </p>
        </div>
      </main>
    </div>
  );
};
