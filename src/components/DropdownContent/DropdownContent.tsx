import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';
import { Sex } from '../../types/Sex';

interface Props {
  people: Person[];
  onSelect: (person: Person) => void;
  setSearchQuery: (query: string) => void;
  setAppliedQuery: (query: string) => void;
}

export const DropdownContent: React.FC<Props> = React.memo((props) => {
  const {
    people,
    onSelect,
    setSearchQuery,
    setAppliedQuery,
  } = props;

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length
          ? people.map(person => (
            <div
              key={person.slug}
              className="dropdown-item"
              onClick={() => {
                onSelect(person);
                setSearchQuery(person.name);
                setAppliedQuery(person.name);
              }}
              aria-hidden
            >
              <p
                className={cn({
                  'has-text-link': person.sex === Sex.MALE,
                  'has-text-danger': person.sex === Sex.FEMALE,
                })}
              >
                {person.name}
              </p>
            </div>
          ))
          : 'No matching suggestions'}
      </div>
    </div>
  );
});
