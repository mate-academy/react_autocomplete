import { Person } from '../../types/Person';

type Props = {
  person: Person;
};

export const PersonItem: React.FC<Props> = ({ person }) => {
  return (
    <div className="dropdown-item" data-cy="suggestion-item">
      <p className="has-text-link">{person.name}</p>
    </div>
  );
};
