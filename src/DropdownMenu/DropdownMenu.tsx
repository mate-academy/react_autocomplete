import React from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

interface Props {
  filteredPeople: Person[];
  onSubmit: (person: Person) => void;
  isFocused: boolean;
  selectedPerson: Person | null;
}

export const DropdownMenu: React.FC<Props> = React.memo((props) => {
  const {
    filteredPeople,
    onSubmit,
    isFocused,
    selectedPerson,
  } = props;

  return (
    <div
      className="dropdown-menu"
      role="menu"
    >
      {isFocused && (
        <div className="dropdown-content">
          {filteredPeople.length
            ? (filteredPeople.map(person => (
              <button
                type="button"
                key={person.slug}
                onClick={() => onSubmit(person)}
                className={cn('btn dropdown-item has-text-link', {
                  'has-text-danger': selectedPerson?.name === person.name,
                })}
              >
                {person.name}
              </button>
            ))
            )
            : (
              <div className="dropdown-item">
                <p className="has-text-link">No matching suggestions</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
});
