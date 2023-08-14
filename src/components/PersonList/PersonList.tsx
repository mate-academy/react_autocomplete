import React from 'react';

import { Person } from '../../types/Person';

type Props = {
  people: Person[],
  onItemClick: (person: Person) => void,
};

export const PersonList: React.FC<Props> = React.memo(({
  people,
  onItemClick,
}) => {
  const handleClick = (event: React.MouseEvent, person: Person) => {
    event.preventDefault();
    onItemClick(person);
  };

  return (
    <>
      {people.map(person => (
        <a
          className="dropdown-item has-text-link"
          href={person.slug}
          onClick={event => handleClick(event, person)}
        >
          {person.name}
        </a>
      ))}
    </>
  );
});
