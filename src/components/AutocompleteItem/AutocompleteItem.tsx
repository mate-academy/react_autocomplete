import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  person: Person,
  handleSelect: (person: Person) => void,
};

export const AutocompleteItem: React.FC<Props> = ({ person, handleSelect }) => (
  <button
    type="button"
    className="dropdown-item"
    onMouseDown={() => handleSelect(person)}
  >
    <p className={cn({
      'has-text-link': person.sex === 'm',
      'has-text-danger': person.sex === 'f',
    })}
    >
      {person.name}
    </p>
  </button>
);
