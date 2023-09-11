import React from 'react';
import classnames from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  person: Person,
  onSelect: (person: Person) => void,
  hasUnderline: boolean,
}

export const DropdownItem: React.FC<Props> = ({
  person,
  onSelect,
  hasUnderline,
}) => {
  const MALE_SIGN = 'm';
  const FEMALE_SIGN = 'f';

  return (
    <>
      <button
        type="button"
        onClick={() => onSelect(person)}
      >
        <p className={classnames({
          'has-text-link': person.sex === MALE_SIGN,
          'has-text-danger': person.sex === FEMALE_SIGN,
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
