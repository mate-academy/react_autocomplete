import React from 'react';
import './PeopleList.scss';
import cn from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  peopleList: Person[];
  onSelected?: (person: Person) => void;
}

export const PeopleList: React.FC<Props> = React.memo(({
  peopleList,
  onSelected = () => { },
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {peopleList.length > 0 ? (
          peopleList.map((person) => (
            <div
              className="dropdown-item"
              key={person.id}
            >
              <button
                className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
                onClick={() => onSelected(person)}
              >
                {person.name}
              </button>
            </div>
          ))
        ) : (
          <div className="dropdown-item">
            <p className="no-suggestions-message">
              No matching suggestions message
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
