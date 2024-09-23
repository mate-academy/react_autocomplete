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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isPoiterEvent, setIsPoiterEvent] = useState(false);

  const personSelect = (person: Person) => {
    setSelectPerson(person);
    setInputChange(person.name);
    setCurrentPeople([]);
    onSelected(person);
    setIsDropdownVisible(false);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputChange(value);

    if (selectPerson && value !== selectPerson.name) {
      setSelectPerson(null);
      clearSelectedPerson();
    }

    debouncedFilterPeople(value);
  };

  const handlePointerEvent = () => {
    setIsPoiterEvent(true);
    setIsDropdownVisible(prev => !prev);
  };

  const handleFocus = () => {
    if (!isPoiterEvent) {
      setIsDropdownVisible(true);
    } else {
      setIsPoiterEvent(false);
    }
  };

  const isDropdownMenuActive = () => {
    return (
      isDropdownVisible &&
      (currentPeople.length || (selectPerson === null && !currentPeople.length))
    );
  };

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isDropdownMenuActive(),
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputChange}
          onChange={handleSearch}
          onPointerDown={handlePointerEvent}
          onFocus={handleFocus}
          data-cy="search-input"
        />
      </div>
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {currentPeople.length > 0 || selectPerson !== null ? (
            currentPeople.map((person: Person) => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                onClick={() => personSelect(person)}
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
