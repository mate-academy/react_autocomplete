import React, { useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import './Autocomplete.scss';

type Props = {
  onSelected: (person: Person) => void;
  people: Person[];
  clearSelectedPerson: () => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  onSelected,
  people,
  clearSelectedPerson,
  delay = 300,
}) => {
  const [inputChange, setInputChange] = useState('');
  const [currentPeople, setCurrentPeople] = useState(people);
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const [focusOnInput, setFocusOnInput] = useState(false);

  const personSelect = (person: Person) => {
    setSelectPerson(person);
    setInputChange(person.name);
    setCurrentPeople([]);
    onSelected(person);
  };

  const debouncedFilterPeople = debounce((inputValue: string) => {
    const filteredPeople = people.filter(person =>
      person.name
        .toLowerCase()
        .trim()
        .includes(inputValue.toLowerCase().trim()),
    );

    setCurrentPeople(filteredPeople);
  }, delay);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputChange(value);

    if (selectPerson && value !== selectPerson.name) {
      setSelectPerson(null);
      clearSelectedPerson();
    }

    debouncedFilterPeople(value);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputChange}
          onChange={handleSelect}
          onFocus={() => setFocusOnInput(true)}
          onBlur={() => setFocusOnInput(false)}
          data-cy="search-input"
        />
      </div>
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div
          className={classNames('dropdown-content', {
            hidden: !focusOnInput || selectPerson !== null,
          })}
        >
          {currentPeople.length > 0 || selectPerson !== null ? (
            currentPeople.map((person: Person) => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                onMouseDown={() => personSelect(person)}
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
    </div>
  );
};
