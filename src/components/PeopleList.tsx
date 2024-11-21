import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect?: (personName: string | undefined) => void;
};

export const PeopleList: React.FC<Props> = React.memo(
  ({ people, onSelect = () => {} }) => {
    const onAnchorClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
      const target = ev.target as HTMLAnchorElement;

      if (target.textContent) {
        onSelect(target.textContent);
      }
    };

    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(person => (
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
              key={person.slug}
            >
              <a className="has-text-link" onClick={onAnchorClick}>
                {person.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
