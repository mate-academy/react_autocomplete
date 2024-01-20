import React from 'react';
import { PeopleDropdown } from '../PeopleDropdown';
import { PeopleMenu } from '../PeopleMenu';
import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

interface Props {
  onSelected: (value: Person) => void;
}

export const Autocomplete: React.FC<Props> = ({ onSelected }) => {
  return (
    <div className="dropdown is-active">
      <PeopleDropdown />

      <PeopleMenu
        onSelected={onSelected}
        people={peopleFromServer}
      />
    </div>
  );
};
