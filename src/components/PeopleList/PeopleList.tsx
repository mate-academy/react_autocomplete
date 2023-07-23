/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[],
  onSelected: (person: Person) => void,
};

export const PeopleList: React.FC<Props> = React.memo(({
  people,
  onSelected,
}) => (
  <div className="dropdown-content">
    {people.map((person: Person) => (
      <div
        className="dropdown-item"
        key={person.slug}
        onClick={() => onSelected(person)}
      >
        <p
          className={cn({
            'has-text-link': person.sex === 'm',
            'has-text-danger': person.sex === 'f',
          })}
        >
          {person.name}
        </p>
      </div>
    ))}
  </div>
),
(prevProps: Props, nextProps: Props): boolean => {
  return prevProps.people === nextProps.people;
});
