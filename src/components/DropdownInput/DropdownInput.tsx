import React from 'react';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';

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
  function findName(event: string) {
    const filteredPeople = peopleFromServer
      .filter(person => person.name
        .toLowerCase().includes(event.toLowerCase()));

    setTimeout(() => {
      setVisiblePeople(filteredPeople);
    }, 1000);
  }

  return (
    <div className="dropdown-trigger">
      <input
        value={inputValue}
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        onClick={() => setVisiblePeople([...peopleFromServer])}
        onChange={(event) => {
          findName(event.target.value.trim());
          setInputValue(event.target.value);
        }}
      />
    </div>
  );
};
