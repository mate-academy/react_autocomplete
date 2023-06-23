import React from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  onSelected: (
    people: Person,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  filterPeople: Person[];
};

export const DropList: React.FC<Props> = React.memo(
  ({ onSelected, filterPeople }) => {
    return (
      <div className="dropdown-menu" role="menu">
        <ul className="dropdown-content">
          {filterPeople.length
            ? (
              filterPeople.map(people => (
                <li
                  className="dropdown-item"
                  key={people.slug}
                >
                  <a
                    href={people.name}
                    className={classNames(
                      'suggestion-link',
                      'has-text-link',
                      { 'has-text-danger': people.sex === 'f' },
                    )}
                    onClick={(event) => onSelected(people, event)}
                  >
                    {people.name}
                  </a>
                </li>
              ))
            ) : (
              <li className="dropdown-item">
                <p>
                  No matching suggestions
                </p>
              </li>
            )}
        </ul>
      </div>
    );
  },
);
