import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onPersonSelect: (person: Person) => void;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({
    people,
    onPersonSelect,
  }) => {
    return (
      <div className="dropdown-menu" role="menu">
        <ul className="dropdown-content">
          {people.length !== 0
            ? (people.map(person => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
              <li
                key={person.slug}
                className="dropdown-item"
                onClick={() => onPersonSelect(person)}
              >
                <p
                  className="has-text-link"
                >
                  {person.name}
                </p>
              </li>
            )))
            : ('No matching suggestions')}
        </ul>
      </div>
    );
  },
);
