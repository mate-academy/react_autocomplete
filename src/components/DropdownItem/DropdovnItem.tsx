import { Person } from '../../types/Person';

type Props = {
  person: Person,
  onClick: (person: Person) => void;
};

export const DropdownItem: React.FC<Props> = ({
  person,
  onClick = () => {},
}) => (
  <div className="dropdown-item">
    <p className="has-text-link">
      <div
        tabIndex={0}
        role="button"
        onMouseDown={() => onClick(person)}
        onKeyDown={() => {}}
      >
        {person.name}
      </div>
    </p>
  </div>
);
