import { Person } from '../../types/Person';

interface Props {
  person: Person;
  onSelected: (person: Person) => void;
}

export const DropItem: React.FC<Props> = ({ person, onSelected }) => {
  return (
    <div className="dropdown-item" data-cy="suggestion-item">
      <p className="has-text-link" onClick={() => onSelected(person)}>
        {person.name}
      </p>
    </div>
  );
};
