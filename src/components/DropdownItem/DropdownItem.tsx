import classNames from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  person: Person,
  onSelect: (personSlug: string) => void
}

export const DropdownItem: React.FC<Props> = ({ person, onSelect }) => {
  return (
    <div
      className="dropdown-item"
      onMouseDown={() => onSelect(person.slug)}
      role="menuitem"
      tabIndex={-1}
    >
      <p
        className={classNames({
          'has-text-link': person.sex === 'm',
          'has-text-danger': person.sex === 'f',
        })}
      >
        {person.name}
      </p>
      {/* <button
        className="button is-info is-small"
        type="button"
        onClick={() => onSelect(person.slug)}
      >
        Select
      </button> */}
    </div>
  );
};
