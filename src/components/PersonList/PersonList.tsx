import React from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  filteredPeople: Person[];
  setSelectedPeople: (person: Person) => void;
  setPageTitle: (string: string) => void;
}

export const PersonList: React.FC<Props> = (
  ({ filteredPeople, setSelectedPeople, setPageTitle }) => {
    const Gender = {
      MALE: 'm',
      FEMALE: 'f',
    };

    const handlePersonSelect = (person: Person) => {
      setSelectedPeople(person);

      const newTitle = person
        ? `${person.name} (${person.born} - ${person.died})`
        : 'No selected person';

      setPageTitle(newTitle);
    };

    const handleOnKeyDown = (event: React.KeyboardEvent, person: Person) => {
      if (event.key === 'Enter' || event.key === ' ') {
        handlePersonSelect(person);
      }
    };

    const handleOnClick = (person: Person) => handlePersonSelect(person);

    return (
      <div
        className="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
        style={{ maxHeight: '240px', overflowY: 'auto' }}
      >
        <ul className="dropdown-content">
          {filteredPeople.map((person: Person) => (
            <button
              type="button"
              className="dropdown-item"
              data-cy="suggestion-item"
              tabIndex={0}
              key={person.slug}
              onClick={() => handleOnClick(person)}
              onKeyDown={(e) => handleOnKeyDown(e, person)}
            >
              <p
                className={classNames({
                  'has-text-link': person.sex === Gender.MALE,
                  'has-text-danger': person.sex === Gender.FEMALE,
                })}
              >
                {person.name}
              </p>
            </button>
          ))}
        </ul>
      </div>
    );
  }
);
