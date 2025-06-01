import React from 'react';
import { Person } from '../types/Person';
import { PersonInfo } from './PersonInfo';

type Props = {
  people: Person[];
  onAdd: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = React.memo(({ people, onAdd }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(p => (
          <PersonInfo key={p.name} person={p} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
});

PeopleList.displayName = 'PeopleList';
