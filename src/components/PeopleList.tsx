import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
  setIsFocused: (boolean: boolean) => void;
  setQuery: (person: string) => void;
};

export const PeopleList: React.FC<Props> = React.memo(({
  people,
  onSelected = () => {},
  setIsFocused = () => {},
  setQuery = () => {},
}) => {
  const handlePersonSelection = (person: Person) => {
    setIsFocused(false);
    onSelected(person);
    setQuery(person.name);
  };

  return (
    <div className="dropdown-menu" role="menu" id="dropdown-menu">
      <div className="dropdown-content">
        {people.map(person => (
          <button
            type="button"
            className="dropdown-item"
            key={person.slug}
            onClick={() => handlePersonSelection(person)}
          >
            <p className="has-text-link">{person.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
});
