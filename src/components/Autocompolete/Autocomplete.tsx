import React, { useState, useCallback } from 'react';
import { debounce } from '../../utils';
import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem';

type Props = {
  people: Person [];
  setPerson: (person: Person | null) => void;
  setAppliedQuery: (e: string) => void;
  delay: number;
  selectedPerson: Person | null;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  setPerson,
  delay,
  setAppliedQuery,
  selectedPerson,
}) => {
  const [focusedInput, setFocusedInput] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(e.target.value);
  };

  const onFocusHandler = () => {
    setFocusedInput(true);
    setPerson(null);
  };

  const onBlurHandler = () => {
    setFocusedInput(false);
    setPerson(null);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          className="input"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          placeholder="Enter a name"
          onChange={handleQueryChange}
          value={selectedPerson?.name}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        />
      </div>

      <div
        className="dropdown-menu"
        id="dropdown-menu"
        role="menu"
      >
        {focusedInput
        && (
          <div className="dropdown-content">
            {people.length === 0
              ? 'No matching suggestions'
              : people.map(person => (
                <DropdownItem
                  key={person.slug}
                  person={person}
                  setPerson={setPerson}
                  setFocusedInput={setFocusedInput}
                />
              ))}
          </div>
        )}

      </div>
    </div>
  );
};
