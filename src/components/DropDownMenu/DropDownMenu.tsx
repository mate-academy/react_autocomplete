import React, { memo } from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  visiblePeople: Person[];
  onSelect: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
    status: boolean
  ) => void;
};

export const DropDownMenu:React.FC<Props> = memo(({
  visiblePeople,
  onSelect,
}) => {
  const onSelected = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    onSelect(event, person, false);
  };

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {visiblePeople.length !== 0
          ? (
            <>
              {visiblePeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                >
                  <a
                    href="/"
                    onClick={(event) => onSelected(event, person)}
                  >
                    <p
                      className={cn(
                        { 'has-text-link': person.sex === 'm' },
                        { 'has-text-danger': person.sex === 'f' },
                      )}
                    >
                      {person.name}
                    </p>
                  </a>
                </div>
              ))}
            </>
          )
          : (
            <div className="dropdown-item">
              <p className="has-text-danger">
                No matching suggestions
              </p>
            </div>
          )}
      </div>
    </div>
  );
});
