import React, { useMemo } from 'react';
import { Person } from '../../types/Person';

type Props = {
  filteredPeople: Person[];
  handlePersonSelect: (person: Person) => void;
  appliedQuery: string;
};

export const Dropdown: React.FC<Props> = ({
  filteredPeople,
  handlePersonSelect,
  appliedQuery,
}) => {
  const people = useMemo(() => {
    return filteredPeople
      .map(person => {
        return (
          <>
            <a
              key={person.slug}
              href="/#"
              onMouseDown={() => handlePersonSelect(person)}
              className="dropdown-item"
            >
              {person.name}
            </a>

            <hr className="dropdown-divider" />
          </>
        );
      });
  }, [appliedQuery]);

  return (
    <div className="dropdown-menu" id="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length
          ? people
          : (
            <div
              className="dropdown-item"
            >
              No matching suggestions
            </div>
          )}
      </div>
    </div>
  );
};
