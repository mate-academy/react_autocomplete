import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onClick: () => void;
};

export const PersonItem: React.FC<Props> = ({ person, onClick }) => {
  return (
    <div className="dropdown-item" data-cy="suggestion-item" onClick={onClick}>
      <p className="has-text-link">{person.name}</p>
    </div>
  );
};
