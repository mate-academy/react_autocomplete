import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person;
  onSelect: (person: Person) => void;
};

export const PersonItem: React.FC<Props> = ({
  person,
  onSelect,
}) => (

  <button
    type="button"
    className="dropdown-item button"
    onClick={() => onSelect(person)}
  >
    <p className={classNames(
      'has-text-link',
      { 'has-text-danger': person.sex === 'f' },
    )}
    >
      {person.name}
    </p>
  </button>

);
