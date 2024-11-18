import { memo } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person) => void;
  onFocus: (isFocus: boolean) => void;
}

export const DropdownMenu: React.FC<Props> = memo(
  ({ people, onSelected, onFocus }) => {
    const handleSelect = (person: Person) => {
      onSelected(person);
      onFocus(false);
    };

    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map(person => (
            <div
              key={person.slug}
              className="dropdown-item is-clickable"
              data-cy="suggestion-item"
              onMouseDown={() => handleSelect(person)}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

DropdownMenu.displayName = 'DropdownMenu';
