import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  setSelectedPerson: (selectedPerson: Person | null) => void,
  selectedPerson: Person | null,
}

export const PeopleList: React.FC<Props> = ({
  people,
  setSelectedPerson,
  selectedPerson,
}) => {
  const handleUserSelect = (person: Person) => {
    if (selectedPerson && selectedPerson.slug === person.slug) {
      return setSelectedPerson(null);
    }

    return setSelectedPerson(person);
  };

  return (
    <div className="dropdown-content">
      {!people.length ? (
        <p>No matching suggestions</p>
      ) : (
        people.map((person) => (
          <a
            href="/#"
            key={person.slug}
            className={cn('dropdown-item', {
              'is-active': selectedPerson?.slug === person.slug,
            })}
            onMouseDown={() => handleUserSelect(person)}
          >
            <p>{person.name}</p>
          </a>
        ))
      )}
    </div>
  );
};
