import React from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

type Props = {
  filteredPeoples: Person[];
  selectedPerson?: Person | null;
  onSelected: (person: Person) => void;
};

export const PostList: React.FC<Props> = ({
  filteredPeoples,
  selectedPerson,
  onSelected,
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {filteredPeoples.map(person => (
          <div
            className={classNames('dropdown-item', {
              'has-background-info': person.name === selectedPerson?.name,
            })}
            data-cy="suggestion-item"
            key={person.name}
            onMouseDown={() => onSelected(person)}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
