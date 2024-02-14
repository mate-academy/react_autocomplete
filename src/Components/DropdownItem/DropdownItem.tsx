import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  person: Person;
  handleItemClick: (person: Person) => void,
};

export const DropdownItem: React.FC<Props> = ({
  person,
  handleItemClick,
}) => {
  return (
    <div
      className="dropdown-item"
      role="button"
      style={{ cursor: 'pointer' }}
      tabIndex={0}
      onKeyDown={() => {}}
      onClick={() => handleItemClick(person)}
    >
      <p className={classNames({
        'has-text-link': person.sex === 'm',
        'has-text-danger': person.sex === 'f',
      })}
      >
        {person.name}
      </p>
    </div>
  );
};
