import cn from 'classnames';
import { Person } from './types/Person';

interface Props {
  person: Person;
  onSelect: (person: Person) => void;
}

export const ListItem = (props: Props) => {
  const { person, onSelect } = props;

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ):void => {
    e.preventDefault();
    onSelect(person);
  };

  return (
    <a
      href="/#"
      className="dropdown-item"
      onClick={handleClick}
    >
      <p
        className={cn({
          'has-text-link': person.sex === 'm',
          'has-text-danger': person.sex === 'f',
        })}
      >
        {person.name}
      </p>
    </a>
  );
};
