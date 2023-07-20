import React from 'react';
import classNames from 'classnames';
import { Person } from './types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = React.memo((({
  people,
  onSelect = () => {},
}) => {
  return (
    <div className="dropdown-content">
      {people.length === 0 ? (
        <div className="dropdown-item">No matching suggestions</div>
      ) : (
        people.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            onClick={() => onSelect(person)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onSelect(person);
              }
            }}

          >
            <p className={classNames({
              'has-text-link': person.sex === 'm',
              'has-text-danger': person.sex === 'f',
            })}
            >
              {person.name}
            </p>
          </div>
        ))
      )}
    </div>
  );
}));
