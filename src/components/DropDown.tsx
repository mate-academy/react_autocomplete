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
      className={classNames(
        'dropdown-menu',
        { 'is-active': isVisible },
        { 'is-hidden': !isVisible },
      )}
      role="menu"
    >
      <div className="dropdown-content">
        {people.length > 0 ? (
          people.map((person) => {
            const { name, sex } = person;

            return (
              <div
                className="dropdown-item"
                role="button"
                key={name}
                tabIndex={0}
                onKeyDown={(evt) => handlePersonKeyDown(evt, person)}
                onMouseDown={() => onSelect(person)}
              >
                <p
                  className={classNames(
                    sex === 'm' ? 'has-text-link' : 'has-text-danger',
                  )}
                >
                  {name}
                </p>
              </div>
            );
          })
        ) : (
          <div className="dropdown-item">
            No matching suggestions
          </div>
        )}
      </div>
    </div>
  );
});
