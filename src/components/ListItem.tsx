import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

interface Props {
  person: Person;
  onSelected: (event: React.MouseEvent, personSlug: string) => void;
}

export const ListItem: React.FC<Props> = ({ person, onSelected }) => {
  return (
    <div className="dropdown-item">
      <a
        href="#/"
        className={classNames('has-text-link', {
          'has-text-danger': person.sex === 'f',
        })}
        onClick={(event) => onSelected(event, person.slug)}
      >
        {person.name}
      </a>
    </div>
  );
};
