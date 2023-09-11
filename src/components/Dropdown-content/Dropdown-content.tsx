import React from 'react';
import { Person } from '../../types/Person';
import { DropdownItem } from '../Dropdown-item/Dropdown-item';

type Props = {
  people: Person[];
  onSelect?: (person: Person) => void;
};

export const DropdownContent: React.FC<Props> = React.memo(
  ({ people, onSelect = () => { } }) => {
    return (
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {people.length ? (
            people.map((person) => (
              <DropdownItem
                key={person.slug}
                person={person}
                onSelect={onSelect}
              />
            ))
          ) : (
            <div className="dropdown-item">
              <p className="has-text-link">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    );
  },
);
