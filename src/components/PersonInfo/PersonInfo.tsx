import classNames from 'classnames';
import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  onSelect: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => void;
}

export const PersonInfo: React.FC<Props> = ({ person, onSelect }) => {
  return (
    <div className="dropdown-item" data-cy="suggestion-item">
      <a href="/" onClick={event => onSelect(event, person)}>
        <p
          className={classNames({
            'has-text-link': person.sex === 'm',
            'has-text-danger': person.sex === 'f',
          })}
        >
          {person.name}
        </p>
      </a>
    </div>
  );
};
