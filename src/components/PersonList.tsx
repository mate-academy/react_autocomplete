import React from 'react';
import { Person } from '../types/Person';
import cn from 'classnames';

type Props = {
  people: Person[];
  handleSuggestionClick: (person: Person) => void;
};

export const PersonList: React.FC<Props> = ({
  people,
  handleSuggestionClick,
}) => {
  return (
    <div className="dropdown-content">
      {people.map(person => (
        <div
          className="dropdown-item"
          data-cy="suggestion-item"
          key={person.slug}
          onClick={() => handleSuggestionClick(person)}
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
  );
};
