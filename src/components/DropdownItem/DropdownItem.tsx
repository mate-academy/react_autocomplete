import classNames from 'classnames';
import { Person } from '../../types/Person';
import './DropdownItem.scss';

interface Props {
  person: Person;
  onSelect: (person: Person) => void;
}

export const DropdownItem: React.FC<Props> = ({ person, onSelect }) => {
  const { name, sex } = person;

  return (
    <div className="dropdown-item">
      <button
        type="button"
        className={classNames(
          'dropdown-item__button',
          {
            'has-text-link': sex === 'm',
            'has-text-danger': sex === 'f',
          },
        )}
        onClick={() => onSelect(person)}
      >
        {name}
      </button>
    </div>
  );
};
