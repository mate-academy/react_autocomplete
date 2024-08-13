import { Person } from '../../types/Person';
import cn from 'classnames';

type Props = {
  person: Person;
  handleListClick: (arg: Person) => void;
};

export const DropdownItem = ({ person, handleListClick }: Props) => {
  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onClick={() => handleListClick(person)}
    >
      <p
        className={cn({
          'has-text-link': person.sex === 'm',
          'has-text-danger': person.sex === 'f',
        })}
      >
        {person.name}
      </p>
    </div>
  );
};
