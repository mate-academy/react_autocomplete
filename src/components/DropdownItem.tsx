import { FC } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person;
  handleSelect: (person: Person) => void;
};

const DropdownItem: FC<Props> = ({ handleSelect, person }) => {
  const { sex, name } = person;

  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onMouseDown={() => handleSelect(person)}
    >
      <p
        className={cn({
          'has-text-link': sex === 'm',
          'has-text-danger': sex === 'f',
        })}
      >
        {name}
      </p>
    </div>
  );
};

export default DropdownItem;
