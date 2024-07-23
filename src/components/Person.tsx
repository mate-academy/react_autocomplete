import React, { useMemo } from 'react';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  appliedQuery: string;
  handleClicks: (person: Person) => void;
};

export const Persons: React.FC<Props> = ({ appliedQuery, handleClicks }) => {
  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(peop =>
      peop.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="dropdown-content">
      {filterPeople.length ? (
        filterPeople.map(person => (
          <div
            className="dropdown-item"
            key={person.slug}
            data-cy="suggestion-item"
          >
            <p
              className="has-text-link"
              onMouseDown={() => handleClicks(person)}
            >
              {person.name}
            </p>
          </div>
        ))
      ) : (
        <div
          className="
                  notification
                  is-danger
                  is-light
                  mt-3
                  is-align-self-flex-start
                "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
