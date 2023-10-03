import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person;
  onSelect: (person: Person) => void;
};

const SEX_MALE = 'm';
const SEX_FEMALE = 'f';

export const DropDownContent: React.FC<Props> = ({
  person,
  onSelect,
}) => (
  <button
    className="dropdown-item"
    type="button"
    key={person.slug}
    onClick={() => onSelect(person)}
    onKeyDown={() => onSelect(person)}
  >
    <p className={classNames({
      'has-text-link': person.sex === SEX_MALE,
      'has-text-danger': person.sex === SEX_FEMALE,
    })}
    >
      {person.name}
    </p>
  </button>
);
