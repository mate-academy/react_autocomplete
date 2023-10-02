import React from 'react';
import { Person } from './types/Person';

type PeopleInfoProps = {
  person: Person;
  onSelect: (person: Person) => void;
};

export const PeopleInfo: React.FC<PeopleInfoProps> = ({ person, onSelect }) => (
  <div
    className="dropdown-item"
    role="button"
    tabIndex={0}
    onMouseDown={() => onSelect(person)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onSelect(person);
      }
    }}
    style={{ cursor: 'pointer' }}
  >
    <p className="has-text-link">
      {person.name}
    </p>
  </div>
);
