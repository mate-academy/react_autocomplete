import React from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

interface PersonListProps {
  people: Person[];
  query: string;
  onPersonSelect: (person: Person) => void;
}

export const PersonList: React.FC<PersonListProps> = ({
  people,
  query,
  onPersonSelect,
}) => {
  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      {filteredPeople.length > 0 ? (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => onPersonSelect(person)}
              >
                <p
                  className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-success': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="notification
          is-danger is-light mt-3 is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
