import React from 'react';
import cn from 'classnames';
import { Person } from './types/Person';

type Props = {
  visiblePeople: Person[];
  onSelect: (person: Person) => void;
};
export const Dropdown: React.FC<Props> = ({ visiblePeople, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {visiblePeople.length === 0 ? (
          <div className="dropdown-item">No matching suggestions</div>
        ) : (
          visiblePeople.map((person) => (
            <button
              type="button"
              className="dropdown-item button-custom"
              onClick={() => onSelect(person)}
            >
              <p
                className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
