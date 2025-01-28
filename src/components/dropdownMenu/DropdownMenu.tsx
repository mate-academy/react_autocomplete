import { DropdownItem } from '../dropdownItem/DropdownItem';
import React from 'react';
import { type Person } from '../../types/Person';

type Props = {
  people: Person[];
  dropdownRef: React.RefObject<HTMLDivElement>;
  setSelectedPerson: React.Dispatch<React.SetStateAction<Person | null>>;
  setDisplayedDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

export const DropdownMenu: React.FC<Props> = ({
  people,
  dropdownRef,
  setSelectedPerson,
  setDisplayedDropdown,
  setQuery,
}: Props) => (
  <div
    className="dropdown-menu"
    role="menu"
    data-cy="suggestions-list"
    ref={dropdownRef}
  >
    <div className="dropdown-content">
      {people.map(person => (
        <DropdownItem
          key={person.slug}
          person={person}
          onSelected={setSelectedPerson}
          setIsDisplayedDropdown={setDisplayedDropdown}
          setQuery={setQuery}
        />
      ))}
    </div>
  </div>
);
