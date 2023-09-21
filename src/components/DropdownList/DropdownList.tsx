import cn from 'classnames';
import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  visiblePeople: Person[] | [],
  setSelectPerson: (man: Person | null) => void,
  setVisiblePeople: (people:Person[] | Person | [] | null) => void,
  setInputValue: (value: string) => void,
};

const WOMEN = 'f';

export const DropdownList: React.FC<Props> = (
  {
    visiblePeople,
    setSelectPerson,
    setVisiblePeople,
    setInputValue,
  },
) => {
  const isDataAvailable = visiblePeople !== null;
  const isVisiblePeopleCount = !!visiblePeople?.length;

  const handlePersonSelection = (person: Person) => {
    return () => {
      if (visiblePeople && person) {
        const selectedPerson = visiblePeople
          ?.find(user => user.slug === person.slug);

        setSelectPerson(selectedPerson || null);
        setVisiblePeople(selectedPerson || []);
        setInputValue(selectedPerson?.name || '');
      }
    };
  };

  return (
    <div className="dropdown-menu" role="menu">
      {isDataAvailable && isVisiblePeopleCount && (
        <div className="dropdown-content">
          {visiblePeople.map(person => (
            <a
              href={`#${person.slug}`}
              onMouseDown={handlePersonSelection(person)}
              className="dropdown-item"
              key={person.slug}
              type="button"
            >
              <p
                className={cn('has-text-link',
                  { 'is-woman': person.sex === WOMEN })}
              >
                {person.name}
              </p>
            </a>
          ))}
        </div>
      )}

      {!isVisiblePeopleCount && (
        <p>Can not find name</p>
      )}
    </div>
  );
};
