import React from 'react';
import { Person } from '../types/Person';
import cn from 'classnames';

type Props = {
  people: Person[];
  onSelect: (selectedName: string) => void;
  visible: boolean;
};

export const PeopleList: React.FC<Props> = React.memo(
  ({ people, onSelect, visible }) => {
    return (
      <div className={`dropdown-item bckg ${visible ? 'visible' : ''}`}>
        <ul>
          {people.map(person => (
            <li
              key={person.id}
              className={cn('item', {
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
              style={{
                cursor: 'pointer',
              }}
              onClick={() => {
                onSelect(person.name);
              }}
              role='presentation'
            >
              {person.name}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
