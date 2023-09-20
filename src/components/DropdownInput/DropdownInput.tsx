import React from 'react';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';
import { findName } from '../../utils/findName';

type Props = {
  inputValue: string,
  setVisiblePeople: (people: Person[]) => void,
  setInputValue: (value: string) => void,
};
export const DropdownInput: React.FC<Props> = (
  {
    inputValue,
    setVisiblePeople,
    setInputValue,
  },
) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    findName(event.target.value.trim(), peopleFromServer, setVisiblePeople);
    setInputValue(event.target.value);
  };

  return (
    <div className="dropdown-trigger">
      <input
        value={inputValue}
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        onClick={() => setVisiblePeople(peopleFromServer)}
        onChange={handleInputChange}
      />
    </div>
  );
};
