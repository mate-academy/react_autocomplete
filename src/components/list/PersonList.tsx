import React from 'react';

import { Person } from '../../types/Person';
import { PersonItem } from '../person/PersonItem';

interface Props {
  people: Person[];
  onSelect: (value: Person) => void;
}

export const PersonList: React.FC<Props> = React.memo(
  ({ people, onSelect }) => (
    <div className="dropdown-content">
      {people.length ? (
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
