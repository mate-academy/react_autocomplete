import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onSelect: (person: Person) => void;
};

export const DropDownMenuItem: React.FC<Props> = React.memo(
  ({ person, onSelect }) => {
    const handleClick = (event: React.MouseEvent) => {
      event.preventDefault();
      onSelect(person);
    };

    return (
      <div
        className="dropdown-item"
        data-cy="suggestion-item"
        onClick={handleClick}
      >
        <p className={person.sex === 'f' ? 'has-text-danger' : 'has-text-link'}>
          {person.name}
        </p>
      </div>
    );
  },
);

DropDownMenuItem.displayName = 'DropDownMenuItem';
