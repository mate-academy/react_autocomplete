import React from 'react';
import classNames from 'classnames';
import { Person } from '../../../types/Person';

enum Sex {
  male = 'm',
  female = 'f',
}

interface Props {
  people: Person[],
  onSelect: (
    event: React.MouseEvent<HTMLAnchorElement>,
    personSlug: string,
  ) => void;
}

export const Dropdown: React.FC<Props> = React.memo(({
  people,
  onSelect,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length
          ? (
            people.map(person => (
              <div
                className="dropdown-item"
                key={person.slug}
              >
                <a
                  className={classNames({
                    'has-text-link': person.sex === Sex.male,
                    'has-text-danger': person.sex === Sex.female,
                  })}
                  href="/"
                  onClick={(event) => onSelect(event, person.slug)}
                >
                  {person.name}
                </a>
              </div>
            ))
          )

          : (
            <div className="dropdown-item">
              <p className="has-text-link">No matching suggestions</p>
            </div>
          )}
      </div>
    </div>
  );
});
