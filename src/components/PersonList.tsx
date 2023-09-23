import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  onSelect: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => void,
};

export const PersonList: React.FC<Props> = ({ people, onSelect }) => (
  <div className="dropdown-menu" role="menu">
    <div className="dropdown-content">
      {!people.length ? (
        <div className="dropdown-item">
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      ) : (
        people.map((person) => (
          <div className="dropdown-item">
            <a
              href="/"
              onClick={e => {
                onSelect(e, person);
              }}
            >
              <p
                className={classNames(
                  person.sex === 'm' ? 'has-text-link' : 'has-text-danger',
                )}
              >
                {person.name}
              </p>
            </a>
          </div>
        ))
      )}
    </div>
  </div>
);
