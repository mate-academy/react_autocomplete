import classNames from 'classnames';
import React from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  selectedPersonId?: string;
  onSelect?: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = React.memo((({
  people,
  selectedPersonId,
  onSelect = () => { },
}) => {
  return (
    <div className="dropdown-menu is-active" role="menu">
      <div className="dropdown-content">
        {(people.length !== 0) ? (people.map((person) => (
          <div
            className={classNames('dropdown-item', {
              'has-background-info': selectedPersonId === person.name,
            })}
            role="button"
            tabIndex={0}
            key={person.name}
            onClick={() => onSelect(person)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Space') {
                onSelect(person);
              }
            }}
          >
            <p className={
              (person.sex === 'm') ? 'has-text-link' : 'has-text-danger'
            }
            >
              {person.name}
            </p>
          </div>
        ))) : (
          <div className="dropdown-item">No matching suggestions</div>
        )}
      </div>
    </div>
  );
}));
