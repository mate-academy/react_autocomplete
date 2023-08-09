import React from 'react';
import { Person } from '../types/Person';

type People = {
  people: Person[];
  onSelected: (person: Person) => void;
};

export const PeopleList: React.FC<People> = React.memo(({
  people, onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      {people.length !== 0 ? (
        <div className="dropdown-content">
          {people.map((person: Person) => {
            return (
              <div className="dropdown-item" key={person.slug}>
                <button
                  type="button"
                  className={
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                  onClick={() => onSelected(person)}
                >
                  {person.name}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        'No matching suggestions'
      )}
    </div>
  );
});
