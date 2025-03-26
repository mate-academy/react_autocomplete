import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  filteredPeople: Person[];
  personClickHandler: (value: Person) => void;
};

export const PeopleList: React.FC<Props> = ({
  filteredPeople,
  personClickHandler,
}) => (
  <>
    {filteredPeople.map(person => (
      <div
        key={person.slug}
        className="dropdown-item"
        data-cy="suggestion-item"
        onMouseDown={() => personClickHandler(person)}
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
  </>
);
