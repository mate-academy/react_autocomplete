import classnames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person
  onSelect: (userId: string) => void;
};

export const DropdownItem: React.FC<Props> = ({ person, onSelect }) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="dropdown-item"
      onClick={() => onSelect(person.slug)}
    >
      <p className={classnames({
        'has-text-link': person.sex === 'm',
        'has-text-danger': person.sex === 'f',
      })}
      >
        {person.name}
      </p>
    </div>
  );
};
