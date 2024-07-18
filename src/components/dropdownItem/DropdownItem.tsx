import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onClick: (person: Person) => void;
};

const DropdownItem = ({ person, onClick }: Props) => {
  const { name, sex } = person;

  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onClick={() => onClick(person)}
    >
      <p className={sex === 'f' ? 'has-text-danger' : 'has-text-link'}>
        {name}
      </p>
    </div>
  );
};

export default DropdownItem;
