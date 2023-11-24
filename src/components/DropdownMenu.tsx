import React, { useMemo } from 'react';
import { Person } from '../types/Person';

interface DropdownMenuProps {
  query: string,
  people: Person[],
  onPersonSelect: (person: Person) => void
}

export const DropdownMenu: React.FC<DropdownMenuProps> = React.memo(({
  query,
  people,
  onPersonSelect = () => {},
}) => {
  const preparedPeople = useMemo(() => {
    return people.filter((person) => person.name
      .toLowerCase()
      .includes(query.toLowerCase()));
  }, [people, query]);

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">

        {
          preparedPeople.length === 0
            ? (<p className="dropdown-item">No matching suggestions</p>)
            : preparedPeople.map(person => (
              <button
                type="button"
                className="button is-ghost dropdown-item underline"
                key={person.slug}
                onClick={() => {
                  onPersonSelect(person);
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <p className="has-text-link">{person.name}</p>
              </button>
            ))
        }
      </div>
    </div>
  );
});
