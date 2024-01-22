import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  setQuery: (query: string) => void;
  setIsListShown: (argument: boolean) => void;
  setSelectedPerson: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = ({
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
      <div className="dropdown-content">
        {people.length
          ? people.map((person) => (
            <div
              className="dropdown-item"
              key={person.slug}
              onKeyDown={() => { }}
              role="button"
              tabIndex={0}
              onClick={() => handleItemClick(person)}
            >
              <p className={classNames({
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
