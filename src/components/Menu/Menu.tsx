import React from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  selectedPersonSlug?: string | undefined;
  onSelect?: (person: Person) => void;
};

export const Menu: React.FC<Props> = React.memo((({
  people,
  selectedPersonSlug,
  onSelect = () => {},
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length !== 0 ? (
          people.map(person => (
            <div
              className={classNames('dropdown-item', {
                'has-background-info': selectedPersonSlug === person.slug,
              })}
              key={person.slug}
            >
              <button
                type="button"
                className="has-text-link"
                onClick={() => onSelect(person)}
              >
                {person.name}
              </button>
            </div>
          ))
        ) : (
          'No matching suggestions'
        )}
      </div>
    </div>
  );
}));
