import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  onSelectPerson: (selectedPerson: Person) => void;
  updateInputValue: (value: string) => void;
}

export const PeopleList: React.FC<Props> = ({
  people,
  onSelectPerson,
  updateInputValue,
}) => {
  const handlePersonClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();
    onSelectPerson(person);
    updateInputValue(person.name);
  };

  return (
    <div
      className="dropdown-menu"
      role="menu"
      aria-labelledby="search-input"
      data-cy="suggestions-list"
    >
      <div className="dropdown-content">
        {people.map((person) => (
          <a
            href="/"
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
            role="button"
            tabIndex={0}
            onClick={(e) => handlePersonClick(e, person)}
          >
            <p className="has-text-link">{person.name}</p>
          </a>
        ))}
      </div>
    </div>
  );
};
