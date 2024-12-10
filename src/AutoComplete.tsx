import React, { useCallback } from 'react';
import Classnames from 'classnames';
import { Person } from './types/Person';
import lodash from 'lodash';
type Props = {
  peopleData: Person[];
  onSelected: (person: Person | null) => void;
  debounceTime?: number;
};
export const AutoComplete: React.FC<Props> = ({
  peopleData,
  onSelected,
  debounceTime = 300,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [onFocusActivated, setOnFocusActivated] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [filteredPeople, setFilteredPeople] =
    React.useState<Person[]>(peopleData);

  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null,
  );

  const handleFocus = () => {
    setOnFocusActivated(true);
  };

  const handleBlur = () => {
    setOnFocusActivated(false);
  };

  const filterPeople = useCallback(
    lodash.debounce((inputValue: string) => {
      const filtered = peopleData.filter(person =>
        person.name.toLowerCase().includes(inputValue.toLowerCase()),
      );

      setFilteredPeople(filtered);
    }, debounceTime),
    [peopleData, input],
  );

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    filterPeople(event.target.value);

    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected(null);
    }
  };

  const handleSelectPerson = (person: Person) => {
    setInput(person.name);
    setFilteredPeople([]);
    setSelectedPerson(person);
    onSelected(person);
  };

  return (
    <>
      <div
        className={Classnames('dropdown', { 'is-active': onFocusActivated })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            ref={inputRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={input}
            onChange={handleInput}
          />
        </div>

        {filteredPeople.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map((person: Person) => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onMouseDown={() => {
                    handleSelectPerson(person);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredPeople.length < 1 && !selectedPerson && (
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
    </>
  );
};
