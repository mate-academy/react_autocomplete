import { Person } from '../../types/Person';
import './PersonInfo.scss';

type Props = {
  person: Person,
  onClick: (person: Person) => void,
};

export const PersonInfo: React.FC<Props> = ({ person, onClick }) => {
  return (
    <div
      className="dropdown-item"
      onClick={() => onClick(person)}
      onKeyUp={() => {}}
      role="menuitem"
      tabIndex={0}
    >
      <p className="has-text-link">
        {person.name}
      </p>
    </div>
  );
};
