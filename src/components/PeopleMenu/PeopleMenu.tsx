import React from 'react';
import { Person } from '../../types/Person';
import { PersonItem } from '../PersonItem';

interface Props {
  people: Person[];
  selectedPerson: Person | null;
  onSelected: (value: Person) => void;
  setIsHide: (value: boolean) => void;
}

export const PeopleMenu: React.FC<Props> = ({
  people,
  selectedPerson,
  onSelected,
  setIsHide,
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
            setIsHide={setIsHide}
          />
        ))}
      </div>
    </div>
  );
};
