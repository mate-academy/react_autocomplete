import { Person } from '../types/Person';

type Props = {
  person: Person;
  onAdd: (person: Person) => void;
};

export const PersonInfo: React.FC<Props> = ({ person, onAdd }) => {
  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onMouseDown={() => {
        onAdd(person);
      }}
    >
      <p className="has-text-link">{person.name}</p>
    </div>
  );
};
