import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person;
  onSelect: (person: Person) => void;
};

export const PersonInfo: React.FC<Props> = ({ person, onSelect }) => {
  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onMouseDown={() => onSelect(person)}
    >
      <p
        className={classNames(
          { 'has-text-link': person.sex === 'f' },
          { 'has-text-danger': person.sex === 'm' },
        )}
      >
        {person.name}
      </p>
    </div>
  );
};
