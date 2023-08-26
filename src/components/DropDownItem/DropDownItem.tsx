import classNames from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  onSelect: (person: Person) => void;
}

const MALE = 'm';
const FEMALE = 'f';

export const DropDownItem: React.FC<Props> = ({ person, onSelect }) => {
  return (
    <button
      type="button"
      className="dropdown-item button"
      onClick={() => onSelect(person)}
    >
      <p className={
        classNames({
          'has-text-link': person.sex === MALE,
          'has-text-danger': person.sex === FEMALE,
        })
      }
      >
        {person.name}
      </p>
    </button>
  );
};
