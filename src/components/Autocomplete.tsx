import React from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

type Props = {
  user: Person[];
  onSelected?: (user: Person | null) => void;
  setValue?: (value: string) => void;
  setAppliedQuery?: (value: string) => void;
};

export const Autocomplete: React.FC<Props> = ({
  user,
  setValue = () => {},
  setAppliedQuery = () => {},
  onSelected = () => {},
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {user.map(person => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            key={peopleFromServer.indexOf(person)}
            onMouseDown={() => {
              onSelected(person);
              setValue('');
              setAppliedQuery('');
            }}
          >
            <p
              className={
                person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
              }
            >
              {person.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
