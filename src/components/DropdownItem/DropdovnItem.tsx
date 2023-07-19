import { Person } from '../../types/Person';

type Props = {
  person: Person,
  onClick?: (person: Person) => void;
};

export const DropdownItem: React.FC<Props> = ({
  person,
  onClick = () => {},
}) => (
  <div className="dropdown-item">
    <p className="has-text-link">
      <a
        href={person.slug}
        onClick={(e) => {
          e.preventDefault();
          onClick(person);
        }}
      >
        {person.name}
      </a>
    </p>
  </div>
);
