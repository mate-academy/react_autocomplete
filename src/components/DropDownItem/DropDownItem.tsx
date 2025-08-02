import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  allPeople: Person[];
  onClick: (index: number) => void;
}

const DropDownItemComponent = ({ person, allPeople, onClick }: Props) => {
  return (
    <div
      className="dropdown-item"
      onClick={() => {
        onClick(allPeople.findIndex(item => item.slug === person.slug));
      }}
      data-cy="suggestion-item"
    >
      <p className={person.sex === 'f' ? 'has-text-danger' : 'has-text-link'}>
        {person.name}
      </p>
    </div>
  );
};

export const DropDownItem = React.memo(DropDownItemComponent);
