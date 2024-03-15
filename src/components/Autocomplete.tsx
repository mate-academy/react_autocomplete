import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';
import 'bulma/css/bulma.css';

interface Delay {
  delay: number;
  onSelected: Person;
  notSelectedPerson: Person;
  rewriteOnSelected: (person: Person) => void;
}

export const Autocomplete: React.FC<Delay> = ({
  delay,
  onSelected,
  notSelectedPerson,
  rewriteOnSelected,
}) => {
  const [firstRender, setFirstRender] = useState(true);
  const [isShowed, setIsShowed] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [instantInputValue, setInstantInputValue] = useState('');
  const [notMatch, setNotMatch] = useState(false);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(currentInput.toLowerCase()),
    );
  }, [currentInput]);

  const applyCurrentInput = useCallback(debounce(setCurrentInput, delay), []);

  const handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyCurrentInput(event.target.value);
    setInstantInputValue(event.target.value);
    rewriteOnSelected(notSelectedPerson);
    setIsShowed(false);
  };

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);

      return;
    }

    if (filteredPeople.length === 0) {
      setNotMatch(true);
      setTimeout(() => {
        setIsShowed(false);
      });
    } else {
      setNotMatch(false);
      setTimeout(() => {
        setIsShowed(true);
      });
    }
  }, [filteredPeople]);

  const handleSelectedPerson = (person: Person) => {
    setInstantInputValue(person.name);
    rewriteOnSelected(person);
  };

  const handleInputOnFocus = () => {
    if (onSelected.name === '' && notMatch === false) {
      setIsShowed(true);
    }
  };

  return (
    <>
      <div className={classNames('dropdown', isShowed && 'is-active')}>
        <div className="dropdown-trigger">
          <input
            value={instantInputValue}
            type="text"
            placeholder="Enter a part of the name"
            className={classNames(
              'input',
              filteredPeople.length === 0 && 'is-danger',
            )}
            data-cy="search-input"
            onChange={handleInputValue}
            onFocus={handleInputOnFocus}
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
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={classNames(
          notMatch &&
            'notification is-danger is-light mt-3 is-align-self-flex-start',
        )}
        role="alert"
        data-cy="no-suggestions-message"
      >
        <p className="has-text-danger">
          {notMatch && 'No matching suggestions'}
        </p>
      </div>
    </>
  );
};
