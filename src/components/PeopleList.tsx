import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected?: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = React.memo(({
  people,
  onSelected = () => { },
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {!people.length
          ? (
            <p className="has-text-danger">No matching suggestions</p>
          ) : (
            people.map(person => (
              <div
                className="dropdown-item button"
                key={person.slug}
                onClick={() => onSelected(person)}
                onKeyDown={() => onSelected(person)}
                role="button"
                tabIndex={0}
              >
                <p className="has-text-link">
                  {person.name}
                </p>
              </div>
            ))
          )}
      </div>
    </div>
  );
});
