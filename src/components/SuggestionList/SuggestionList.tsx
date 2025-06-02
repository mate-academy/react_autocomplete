import React from 'react';
import { Person } from '../../types/Person';
import cn from 'classnames';

type Props = {
  people: Person[];
  onSelectPerson: (person: Person) => void;
};

export const SuggestionList: React.FC<Props> = ({ people, onSelectPerson }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
            onClick={() => onSelectPerson(person)}
          >
            <p
              className={cn({
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
};
