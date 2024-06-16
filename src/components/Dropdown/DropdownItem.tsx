import { Person } from '../../types/Person';
import { useDropdownApi } from './Context';

type Props = {
  person: Person;
};

export const DropdownItem: React.FC<Props> = ({ person }) => {
  const { onSelected, changeInputPersonName } = useDropdownApi();

  const handleClick = () => {
    changeInputPersonName(person.name);
    onSelected(person.name);
  };

  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onMouseDown={handleClick}
    >
      <p className={person.sex === 'f' ? 'has-text-danger' : 'has-text-link'}>
        {person.name}
      </p>
    </div>
  );
};
