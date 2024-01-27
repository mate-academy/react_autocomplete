import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  visiblPeople: Person[];
  selectPerson: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    human: Person
  ) => void;
};

export const DropdownContent: React.FC<Props> = ({
  visiblPeople,
  selectPerson,
}) => (
  <div className="dropdown-content">
    {visiblPeople.map(human => (
      <a
        href="#title"
        className="dropdown-item"
        data-cy="suggestion-item"
        key={human.name}
        onClick={e => selectPerson(e, human)}
      >
        {human.name}
      </a>
    ))}
  </div>
);
