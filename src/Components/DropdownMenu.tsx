import cn from 'classnames';

import { Person } from '../types/Person';

interface Props {
  filteredPeople: Person[],
  onSelected: (person: Person) => void,
}

export const DropdownMenu: React.FC<Props> = ({
  filteredPeople,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {filteredPeople.length
          ? (
            filteredPeople.map((person) => (
              <div className="dropdown-item">
                <button
                  type="button"
                  key={person.slug}
                  onClick={() => onSelected(person)}
                  className={cn(
                    'button',
                    'is-white',
                    {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    },
                  )}
                >
                  {person.name}
                </button>
              </div>
            )))
          : (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
      </div>
    </div>
  );
};
