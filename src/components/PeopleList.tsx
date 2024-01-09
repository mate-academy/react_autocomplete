/* eslint-disable */
import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect: (selectedName: string) => void;
};

export const PeopleList: React.FC<Props> = React.memo(
  ({ people, onSelect }) => {
    return (
      <div className="dropdown-item">
        <ul>
          {people.map(person => (
            <li
              key={person.id}
              className="has-text-link"
              onClick={() => {
                onSelect(person.name);
              }}
            >
              {person.name}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
