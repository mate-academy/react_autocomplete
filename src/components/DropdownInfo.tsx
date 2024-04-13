import { Person } from '../types/Person';

interface Props {
  people: Person;
  setPerson: React.Dispatch<React.SetStateAction<Person>>;
}

export const DropdownInfo: React.FC<Props> = ({ people, setPerson }) => {
  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      onClick={() => setPerson(people)}
      key={people.name}
    >
      <p className="has-text-link">{people.name}</p>
    </div>
  );
};
