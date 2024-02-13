import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  onPersonSelected: (selectedPerson: Person) => void,
}

export const PeopleInfo: React.FC<Props> = ({
  person,
  onPersonSelected,
}) => {
  const handlePersonClicked = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    selectedPerson: Person,
  ) => {
    event.preventDefault();
    onPersonSelected(selectedPerson);
  };

  return (
    <div className="dropdown-item">
      <a
        onClick={(event) => handlePersonClicked(event, person)}
        href={`#${person.slug}`}
        className={person.sex === 'm' ? 'has-text-link' : 'has-text-danger'}
      >
        {person.name}
      </a>
    </div>
  );
};
