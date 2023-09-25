import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  isVisible: boolean;
  onSelect?: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = React.memo(({
  people,
  isVisible,
  onSelect = () => { },
}) => {
  return (
    <div
      className={`dropdown-menu ${isVisible ? 'is-active' : 'is-hidden'}`}
      role="menu"
    >
      <div className="dropdown-content">
        {(people.length === 0) ? (
          <div className="dropdown-item">
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ) : (
          people.map((person) => (
            <div
              role="button"
              tabIndex={0}
              key={person.name}
              className="dropdown-item"
              onClick={() => onSelect(person)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Space') {
                  onSelect(person);
                }
              }}
            >
              <p
                className={classNames(
                  person.sex === 'm' ? 'has-text-link' : 'has-text-danger',
                )}
              >
                {person.name}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
