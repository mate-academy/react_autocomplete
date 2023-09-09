import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  person: Person,
  onSelected: (person: Person) => void,
  hasUnderline: boolean,
};

export const DropDownItem: React.FC<Props> = ({
  person,
  onSelected,
  hasUnderline,
}) => {
  return (
    <>
      <button
        type="button"
        onClick={() => onSelected(person)}
      >
        <p className={cn({
          'has-text-link': person.sex === 'm',
          'has-text-danger': person.sex === 'f',
        })}
        >
          {person.name}
        </p>
      </button>
      {hasUnderline && (
        <hr className="dropdown-divider" />
      )}
    </>
  );
};
