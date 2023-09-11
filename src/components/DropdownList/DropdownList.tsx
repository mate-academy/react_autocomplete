import cn from 'classnames';
import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  visiblePeople: Person[] | [],
  setSelectPerson: (man: Person | null) => void,
  setVisiblePeople: (people:Person[] | []) => void,
  setInputValue: (value: string) => void,
};
export const DropdownList: React.FC<Props> = (
  {
    visiblePeople,
    setSelectPerson,
    setVisiblePeople,
    setInputValue,
  },
) => {
  const isDataAvailable = visiblePeople !== null;

  return (
    <div className="dropdown-menu" role="menu">
      {isDataAvailable && (
        visiblePeople?.length > 0 ? (
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <a
                href={`#${person.slug}`}
                onMouseDown={() => {
                  if (visiblePeople && person) {
                    const selectedPerson = visiblePeople
                      ?.find(user => user.slug === person.slug);

                    setSelectPerson(selectedPerson || null);
                    setVisiblePeople([]);
                    setInputValue(selectedPerson?.name || '');
                  }
                }}
                className="dropdown-item"
                key={person.slug}
                type="button"
              >
                <p
                  className={cn('has-text-link',
                    { 'is-woman': person.sex === 'f' })}
                >
                  {person.name}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <p>Can not find name</p>
        )
      )}
    </div>
  );
};
