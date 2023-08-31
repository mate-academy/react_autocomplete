import React from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[],
  onSelect: (person: Person) => void,
  onFocus: boolean,
};

export const PeopleMatch: React.FC<Props> = React.memo(({
  people,
  onSelect = () => { },
  onFocus,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length === 0 ? (
          <div className="dropdown-item">
            <p className="has-text-danger">No matches found</p>
          </div>

        ) : (
          people.map(person => (
            onFocus && (
              <button
                type="button"
                className="dropdown-item button"
                key={person.slug}
                onClick={() => onSelect(person)}
              >
                <p className={classNames(
                  person.sex === 'm' ? 'has-text-link' : 'has-text-danger',
                )}
                >
                  {person.name}
                </p>
              </button>
            ))))}
      </div>
    </div>
  );
});
