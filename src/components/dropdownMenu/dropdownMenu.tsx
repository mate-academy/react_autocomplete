import React from 'react';
import { Person } from '../../types/Person';
import './dropdownMenu.scss';

interface Props {
  people: Person[];
  onChangeSelPerson: (person: Person) => void;
}

const PERSON_FEMALE = 'f';

export const DropdownMenu: React.FC<Props> = ({
  people,
  onChangeSelPerson,
}) => (
  <div
    className="dropdown-menu dropdownMenu"
    role="menu"
    data-cy="suggestions-list"
  >
    <div className="dropdown-content dropdownMenu__list">
      {people.map(person => (
        <button
          key={person.slug}
          className="dropdown-item dropdownMenu__item"
          data-cy="suggestion-item"
          onMouseDown={() => onChangeSelPerson(person)}
        >
          <p
            className={
              person.sex === PERSON_FEMALE ? 'has-text-danger' : 'has-text-link'
            }
          >
            {person.name}
          </p>
        </button>
      ))}
    </div>
  </div>
);
