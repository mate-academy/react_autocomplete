import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect?: (person: Person) => void;
  isVisible: boolean;
};

export const DropDown: React.FC<Props> = React.memo(({
  people,
  onSelect = () => { },
  isVisible,
}) => {
  const handlePersonKeyDown = (
    evt: React.KeyboardEvent<HTMLDivElement>,
    person: Person,
  ) => {
    evt.preventDefault();

    onSelect(person);
  };

  return (
    <div
      className={`dropdown-menu ${isVisible
        ? 'is-active'
        : 'is-hidden'
      }`}
      role="menu"
    >
      <div className="dropdown-content">
        {people.length > 0 ? (
          people.map((person) => (
            <div
              className="dropdown-item"
              role="button"
              key={person.name}
              tabIndex={0}
              onKeyDown={(evt) => handlePersonKeyDown(evt, person)}
              onMouseDown={() => onSelect(person)}
            >
              <p
                className={classNames(
                  person.sex === 'm' ? 'has-text-link' : 'has-text-danger',
                )}
              >
                {person.name}
              </p>
            </div>
          ))
        ) : (
          <div className="dropdown-item">
            No matching suggestions
          </div>
        )}
      </div>
    </div>
  );
});
