import React from 'react';
import { DropDownItem } from '../dropdown_item/dropDownItem';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  setTitle: (arg: string) => void;
  setFocused: (arg: boolean) => void;
  setQuery: (arg: string) => void;
}

export const DropDownContent: React.FC<Props> = ({
  people,
  setTitle,
  setFocused,
  setQuery,
}) => {
  return (
    <div className="dropdown-content">
      {people.map((person: Person) => (
        <DropDownItem
          person={person}
          setTitle={setTitle}
          setFocused={setFocused}
          setQuery={setQuery}
          key={person.name}
        />
      ))}
    </div>
  );
};
