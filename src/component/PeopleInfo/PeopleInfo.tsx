import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  name: string;
  onSelected: (key: Person) => void;
  person: Person;
}

export const PeopleInfo: React.FC<Props> = React.memo(
  ({ name, onSelected, person }) => {
    return (
      <div
        className="dropdown-item"
        data-cy="suggestion-item"
        onClick={() => onSelected(person)}
      >
        <p className="has-text-link">{name}</p>
      </div>
    );
  },
);

PeopleInfo.displayName = 'PeopleInfo';
