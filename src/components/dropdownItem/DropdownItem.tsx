import React, { Dispatch, SetStateAction } from 'react';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onSelected: Dispatch<SetStateAction<Person | null>>;
  setIsDisplayedDropdown: Dispatch<SetStateAction<boolean>>;
  setQuery: Dispatch<SetStateAction<string>>;
};

export const DropdownItem: React.FC<Props> = ({
  person,
  onSelected,
  setIsDisplayedDropdown,
  setQuery,
}: Props) => {
  return (
    <div
      className="dropdown-item"
      key={person.slug}
      data-cy="suggestion-item"
      onClick={() => {
        onSelected(person);
        setIsDisplayedDropdown(false);
        setQuery(person.name);
      }}
    >
      <p className="has-text-link">{person.name}</p>
      {/*todo add class for has-text-danger if person is dead*/}
    </div>
  );
};
