import React from 'react';
import { Person } from '../../types/Person';
import { PersonItem } from '../PersonItem';

interface Props {
  people: Person[];
  selectedPerson: Person | null;
  onSelected: (value: Person) => void;
}

export const PeopleMenu: React.FC<Props> = ({
  people,
  selectedPerson,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.map(person => (
          <PersonItem
            key={person.slug}
            person={person}
            selectedPerson={selectedPerson}
            onSelected={onSelected}
          />
        ))}
      </div>
    </div>
  );
};
