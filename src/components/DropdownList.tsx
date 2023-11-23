import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onHover: (val: boolean) => void;
  onSelect?: (person: Person) => void;
  onPersonSelect?: (name: string) => void;
};

export const DropdownList: React.FC<Props> = ({
  people,
  onHover = () => {},
  onSelect = () => {},
  onPersonSelect = () => {},
}) => {
  const handleClick = (person: Person) => {
    onSelect(person);
    onPersonSelect(person.name);
  };

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length !== 0
          ? (people.map(person => (
            <a
              href="/#"
              key={person.slug}
              className="dropdown-item"
              onMouseEnter={() => onHover(true)}
              onMouseLeave={() => onHover(false)}
              onClick={() => handleClick(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </a>
          )))
          : (
            <p className="dropdown-item has-text-link">
              No matching suggestions
            </p>
          )}
      </div>
    </div>
  );
};
