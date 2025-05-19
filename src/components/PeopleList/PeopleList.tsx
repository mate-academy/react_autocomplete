import React from 'react';
import { Person } from '../../types/Person';
import { PersonInfo } from '../PersonInfo/PersonInfo';

interface PeopleListProps {
  peoples: Person[];
  onSelected: (person: Person) => void;
  onClose: () => void;
}

export const PeopleList: React.FC<PeopleListProps> = ({
  peoples,
  onSelected,
  onClose,
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {peoples.map(person => (
          <PersonInfo
            person={person}
            key={person.slug}
            onSelected={onSelected}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
};
