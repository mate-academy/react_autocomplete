import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  selectedPerson: Person | null;
  onSelected: (value: Person) => void;
  setIsHide: (value: boolean) => void;
  setQuery: (value: string) => void;
  setAppliedQuery: (value: string) => void;
}

export const PersonItem: React.FC<Props> = ({
  person,
  selectedPerson,
  onSelected,
  setIsHide,
  setQuery,
  setAppliedQuery,
}) => {
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    selectedItem: Person,
  ) => {
    event.preventDefault();
    setQuery(person.name);
    setAppliedQuery(person.name);
    onSelected(selectedItem);
    setIsHide(false);
  };

  return (
    <div className="dropdown-item">
      <a
        onClick={event => handleClick(event, person)}
        href={`#${selectedPerson?.slug}`}
        className={person.sex === 'm'
          ? 'has-text-link'
          : 'has-text-danger'}
      >
        {person.name}
      </a>
    </div>
  );
};
