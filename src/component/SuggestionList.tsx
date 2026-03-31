import { Person } from '../types/Person';
import { PersonInfo } from './PersonInfo';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
};

export const SuggestionList: React.FC<Props> = ({ people, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <PersonInfo key={person.name} person={person} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};
