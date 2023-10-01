import React from 'react';
import { Person } from './types/Person';
import { PeopleInfo } from './PeopleInfo';

type Props = {
  people: Person [];
  onSelect: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = ({ people, onSelect }) => (
  <div className="dropdown-menu" id="dropdown-menu" role="menu">
    <div className="dropdown-content">
      {people.length === 0 ? (
        <div className="dropdown-item">
          <p>No matching suggestions</p>
        </div>
      ) : people.map(person => (
        <PeopleInfo
          person={person}
          key={person.slug}
          onSelect={() => onSelect(person)}
        />
      ))}
    </div>
  </div>
);
