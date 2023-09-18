import classnames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person
  onSelect: (userId: string) => void;
};

export const DropdownItem: React.FC<Props> = ({ person, onSelect }) => {
  const { slug, sex, name } = person;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className="dropdown-item"
      onClick={() => onSelect(slug)}
    >
      <p className={classnames({
        'has-text-link': sex === 'm',
        'has-text-danger': sex === 'f',
      })}
      >
        {name}
      </p>
    </div>
  );
};
