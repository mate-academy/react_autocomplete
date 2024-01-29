import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  onSelectPerson: (selectedPerson: Person) => void;
}

export const PeopleList: React.FC<Props> = ({ people, onSelectPerson }) => {
  const handlePersonClick
  = (event: React.MouseEvent<HTMLDivElement>, person: Person) => {
    event.preventDefault();
    onSelectPerson(person);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    person: Person,
  ) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      onSelectPerson(person);
    }
  };

  return (
    <div
      className="dropdown-menu"
      role="menu"
      data-cy="suggestions-list"
    >
      <div className="dropdown-content">
        {people.map((person) => (
          <div
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
            role="button"
            tabIndex={0}
            onClick={(e) => handlePersonClick(e, person)}
            onKeyDown={(e) => handleKeyDown(e, person)}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
