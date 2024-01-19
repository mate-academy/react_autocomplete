import React from 'react';
import { PeopleDropdown } from '../PeopleDropdown';
import { PeopleMenu } from '../PeopleMenu';

interface Props {
  onSelected: (value: boolean) => void;
}

export const Autocomplete: React.FC<Props> = ({ onSelected }) => {
  return (
    <div className="dropdown is-active">
      <PeopleDropdown />

      <PeopleMenu onSelected={onSelected} />
    </div>
  );
};
