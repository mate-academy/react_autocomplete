import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  person: Person,
  onSelected: (value: string) => void
}

export const List: React.FC<Props> = ({
  person,
  onSelected,
}) => {
  const handlerOnKey = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSelected(person.name);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="dropdown-item"
      onClick={(event) => onSelected(event.currentTarget.innerText)}
      onKeyDown={handlerOnKey}
    >
      <p className="has-text-link">{person.name}</p>
    </div>
  );
};
