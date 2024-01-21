import React, { MouseEvent } from 'react';
import { Person } from '../types/Person';

type Props = {
  person: Person;
  handleOnClick: (
    event: MouseEvent,
    person: Person
  ) => void
};

export const DropItems: React.FC<Props> = ({ person, handleOnClick }) => {
  return (
    <div className="dropdown-item">
      <a
        href="/"
        onClick={event => handleOnClick(event, person)}
      >
        <p className="has-text-link">
          {person.name}
        </p>
      </a>
    </div>
  );
};
