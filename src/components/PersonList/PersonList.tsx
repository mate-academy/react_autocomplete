import React from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  filteredPeople: Person[];
  setSelectedPeople: (person: Person) => void;
}

export const PersonList: React.FC<Props> = React.memo(
  ({ filteredPeople, setSelectedPeople }) => {
    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map((person: Person) => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              role="button"
              tabIndex={0}
              key={person.slug}
              onClick={() => setSelectedPeople(person)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedPeople(person);
                }
              }}
            >
              <p
                className={classNames({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
