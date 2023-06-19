import React from 'react';
import { Person } from './types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person) => void;
}

export const DropdownMenu: React.FC<Props> = ({
  people,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length > 0
          ? (
            people.map((person) => (
              <div className="dropdown-item" key={person.slug}>
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
                <p
                  className={person.sex === 'm'
                    ? 'has-text-link'
                    : 'has-text-danger'}
                  onClick={() => onSelected(person)}
                >
                  {person.name}
                </p>
              </div>
            ))
          ) : (
            <span className="dropdown-item">
              No matching suggestions
            </span>
          )}
      </div>
    </div>
  );
};
