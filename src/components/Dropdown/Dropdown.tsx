import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  filteredPeople: Person[];
  handlePersonSelect: (person: Person) => void;
};

export const Dropdown: React.FC<Props> = ({
  filteredPeople,
  handlePersonSelect,
}) => {
  const people = filteredPeople
    .map(person => {
      return (
        <>
          <a
            key={person.slug}
            href="/#"
            onMouseDown={() => handlePersonSelect(person)}
            className={cn(
              { 'has-text-primary': person.sex === 'f' },
              { 'has-text-link': person.sex === 'm' },
              'dropdown-item',
            )}
          >
            {person.name}
          </a>

          <hr className="dropdown-divider" />
        </>
      );
    });

  return (
    <div className="dropdown-menu" id="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length
          ? people
          : (
            <div
              className="dropdown-item"
            >
              No matching suggestions
            </div>
          )}
      </div>
    </div>
  );
};
