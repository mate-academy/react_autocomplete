import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  person: Person,
  onSelected: (person: Person) => void
}

export const PersonName: React.FC<Props> = ({
  person,
  onSelected,
}) => {
  const handlerOnKey = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      onSelected(person);
    }
  };

  const handleOnClick = () => {
    onSelected(person);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="dropdown-item"
      onClick={handleOnClick}
      onKeyDown={handlerOnKey}
    >
      <p className="has-text-link">{person.name}</p>
    </div>
  );
};
