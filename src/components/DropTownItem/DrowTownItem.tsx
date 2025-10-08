import { Person } from '../../types/Person';

interface Props {
  onSelect: (person: Person) => void;
  person: Person;
}

export const DropTownItem: React.FC<Props> = ({ person, onSelect }) => {
  // console.log('render DropTownItem');

  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onClick={() => onSelect(person)}
    >
      <p className="has-text-link">{person.name}</p>
    </div>
  );
};
