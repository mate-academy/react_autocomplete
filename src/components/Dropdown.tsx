import React, { FC } from 'react';
import { Person } from '../types/Person';
import { DropdownItem } from './DropdownItem';

interface Props {
  people: Person[];
  searchName: string,
  setSearchName: (value: string) => void,
  setSelectedPersonSlug: (value: string) => void,
  findSelectedPerson: Person | null,
}

export const Dropdown: FC<Props> = React.memo(({
  people,
  searchName,
  setSearchName,
  setSelectedPersonSlug,
  findSelectedPerson,
}) => {
  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={searchName}
          onChange={(event) => setSearchName(event.target.value)}
        />
      </div>

      {searchName && searchName !== findSelectedPerson?.name && (
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {people.length === 0 && 'No matching suggestions'}

            {people.map(person => (
              <DropdownItem
                person={person}
                key={person.slug}
                setSelectedPerson={setSelectedPersonSlug}
                setSearchName={setSearchName}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
