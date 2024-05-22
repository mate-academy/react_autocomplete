import React from 'react';
import { Person } from '../../types/Person';

interface Prop {
  person: Person;
  setTitle: (arg: string) => void;
  setFocused: (arg: boolean) => void;
}

export const DropDownItem: React.FC<Prop> = ({
  person,
  setTitle,
  setFocused,
}) => {
  const selectedPersonTitle = `${person.name} (${person.born} - ${person.died})`;

  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onClick={() => {
        setTitle(selectedPersonTitle);
        setFocused(false);
      }}
    >
      <p className="has-text-link">{person.name}</p>
    </div>
  );
};
