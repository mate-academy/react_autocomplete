import React, { useState } from 'react';

import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem';

interface Props {
  people: Person[],
  onSort: (value: Person) => void;
}

export const Dropdown: React.FC<Props> = ({ people, onSort }) => {
  const [input, setInput] = useState('');
  const [peopleList, setPeopleList] = useState(people);

  const sortPeople = (p: string) => {
    const sortedPerson = [...people];

    sortedPerson.filter(person => {
      return person.name.includes(p);
    });

    setPeopleList(sortedPerson);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    sortPeople(value);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onChange={e => handleInputChange(e.target.value)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {peopleList.map(person => (
            <DropdownItem name={person.name} key={person.name} />
          ))}
        </div>
      </div>
    </div>
  );
};
