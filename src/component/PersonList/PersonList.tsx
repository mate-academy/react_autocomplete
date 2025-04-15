import { Person } from '../../types/Person';
import { PersonItem } from '../PersonItme/PersonItem';

type Props = {
  persons: Person[];
};

export const PersonList: React.FC<Props> = ({ persons }) => {
  return (
    <div className="dropdown-content">
      {persons.map((person: Person) => (
        <PersonItem key={person.slug} person={person} />
      ))}
    </div>
  );
};
