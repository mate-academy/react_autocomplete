import React from 'react';

import { Person } from '../../types/Person';
import { PersonItem } from '../PersonItem/PersonItem';

interface Props {
  people: Person[] | null;
  onSelect: (value: Person) => void;
}

export const PersonList: React.FC<Props> = React.memo(
  ({ people, onSelect }) => (
    <div className="dropdown-content">
      {people ? (
        people.map(person => (
          <PersonItem
            key={person.slug}
            person={person}
            onSelect={onSelect}
          />
        ))
      ) : (
        <div className="dropdown-item">
          No matching suggestions
        </div>
      )}
    </div>
  ),
);
