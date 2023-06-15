import React from 'react';
import { Person } from '../types/Person';
import { DropItem } from './DropItem';

type Props = {
  people: Person[],
  onSelect: (person: Person) => void
};

export const DropMenu: React.FC<Props> = React.memo(({ people, onSelect }) => (
  <div className="dropdown-menu" role="menu">
    <div className="dropdown-content">
      {!people.length ? (
        <div className="dropdown-item">
          No matching suggestions
        </div>
      ) : (
        people.map(person => (
          <DropItem
            key={person.slug}
            person={person}
            onSelected={onSelect}
          />
        ))
      )}
    </div>
  </div>
));
