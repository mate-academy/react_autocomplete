import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  person: Person,
  setPerson: (value: Person) => void;
  setQuery: (value: string) => void;
  setIsDropdownShow: (value: boolean) => void;
};

export const DropdownItem: React.FC<Props> = ({
  person,
  setPerson,
  setQuery,
  setIsDropdownShow,
}) => {
  const handleItemClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setPerson(person);
    setQuery(person.name);
    setIsDropdownShow(false);
  };

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      href="#"
      className="dropdown-item"
      onClick={handleItemClick}
    >
      <p className={classNames({
        'has-text-link': person.sex === 'm',
        'has-text-danger': person.sex === 'f',
      })}
      >
        {person.name}
      </p>
    </a>
  );
};
