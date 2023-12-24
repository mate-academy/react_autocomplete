import React, { useState, useEffect } from 'react';

import { Person } from '../../types/Person';
import { DropdownList } from '../DropdownList/DropdownList';

interface Props {
  people: Person[],
  setPerson: React.Dispatch<React.SetStateAction<Person | null>>;
}

export const Dropdown: React.FC<Props> = ({ people, setPerson }) => {
  const [query, setQuery] = useState('');

  const [searchedPerson, setSearchedPerson] = useState<Person[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filteredPeople = people.filter((person) => person
        .name.toLowerCase().includes(query.toLowerCase()));

      setSearchedPerson(filteredPeople);
    }, 1000);

    // Clear the timeout on component unmount or when the query changes
    return () => clearTimeout(timeoutId);
  }, [query, people]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <DropdownList people={searchedPerson} setPerson={setPerson} />
      </div>
    </div>
  );
};
