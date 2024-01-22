import React from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  setQuery: (query: string) => void;
  setIsListShown: (arg: boolean) => void;
  setSelectedPerson: (person: Person) => void;
}

export const DropdownList: React.FC<Props> = ({
  people,
  setQuery,
  setIsListShown,
  setSelectedPerson,
}) => {
  const handleItemClick = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setIsListShown(false);
  };

  return (
    <div className="dropdown-menu" role="menu">
      <div
        className="dropdown-content"
        style={{
          maxHeight: 300,
          overflowY: 'auto',
        }}
      >
        {people.length
          ? people.map((person) => (
            <div
              className="dropdown-item"
              key={person.name}
              onKeyDown={() => { }}
              role="button"
              tabIndex={0}
              onClick={() => handleItemClick(person)}
            >
              <p className={cn({
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
              >
                {person.name}
              </p>
            </div>
          ))
          : <p style={{ textAlign: 'center' }}>No matching suggestions</p>}

      </div>
    </div>
  );
};
