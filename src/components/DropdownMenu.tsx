import React from 'react';
import { Person } from '../types/Person';

type Props = {
  peopleFromServer: Person[];
  onSelect: (person: Person) => void;
};

export const DropdownMenu: React.FC<Props> = ({
  peopleFromServer,
  onSelect,
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {peopleFromServer.map(person => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            style={{ cursor: 'pointer' }}
            key={person.slug}
            onClick={() => onSelect(person)}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
        {peopleFromServer.length === 0 ? (
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
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
