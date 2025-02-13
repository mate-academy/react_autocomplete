import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect?: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = React.memo(
  ({ people, onSelect = () => {} }) => {
    return (
      <div className="dropdown-content">
        {people.map(person => {
          return (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.name}
            >
              <p
                className="has-text-link"
                onMouseDown={() => {
                  onSelect(person);
                }}
              >
                {person.name}
              </p>
            </div>
          );
        })}
      </div>
    );
  },
);

PeopleList.displayName = 'PeopleList';
