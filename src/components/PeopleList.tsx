import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  onSelected: (person: Person) => void,
};

const onSelect = (
  event: React.MouseEvent<HTMLAnchorElement>,
  person: Person,
  onSelected: (person: Person) => void,
) => {
  event.preventDefault();
  onSelected(person);
};

export const PeopleList: React.FC<Props> = ({
  people,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length !== 0
          ? people.map(person => (
            <a
              href="/#"
              className="dropdown-item"
              onClick={event => onSelect(event, person, onSelected)}
            >
              <p
                className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </a>
          ))
          : (
            <div className="dropdown-item">
              <p className="has-text-danger">No match suggestions</p>
            </div>
          )}
      </div>
    </div>
  );
};
