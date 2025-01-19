import { Person } from '../../types/Person';

type Props = {
  filteredNames: Person[];
  onSelected: (person: Person) => void;
};

export const DropdownMenu: React.FC<Props> = ({
  filteredNames,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {filteredNames.map(person => (
          <div
            key={person.slug}
            tabIndex={0}
            className="dropdown-item"
            data-cy="suggestion-item"
            onClick={() => onSelected(person)}
            onMouseEnter={e => {
              e.currentTarget.classList.add('has-background-primary-90');
            }}
            onMouseLeave={e => {
              e.currentTarget.classList.remove('has-background-primary-90');
            }}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
