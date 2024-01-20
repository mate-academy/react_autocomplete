import React from 'react';
import { Person } from '../../types/Person';
import { PersonItem } from '../PersonItem';

interface Props {
  people: Person[];
  onSelected: (value: Person) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PeopleMenu: React.FC<Props> = ({ people, onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.map(person => (
          <PersonItem
            key={person.slug}
            person={person}
          />
        ))}
      </div>
    </div>
  );
};
