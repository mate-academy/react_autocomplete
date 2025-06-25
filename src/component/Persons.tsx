import React from 'react';
import { Person } from '../types/Person';

interface PersonsComponentProps {
  peoples: Person[];
  onSelected: (person: Person) => void;
}

const PersonsComponent: React.FC<PersonsComponentProps> = ({
  peoples,
  onSelected,
}) => {
  return (
    <div
      className="dropdown-menu"
      id="dropdown-menu"
      role="menu"
      data-cy="suggestions-list"
    >
      <div className="dropdown-content">
        {peoples.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}

        {peoples.length > 0 &&
          peoples.map((person: Person) => (
            <a
              className="dropdown-item"
              key={person.slug}
              href={`#${person.slug}`}
              data-cy="suggestion-item"
              onClick={() => onSelected(person)}
            >
              {`${person.name} (${person.born} - ${person.died})`}
            </a>
          ))}
      </div>
    </div>
  );
};

export const Persons = React.memo(PersonsComponent);
Persons.displayName = 'Persons';
