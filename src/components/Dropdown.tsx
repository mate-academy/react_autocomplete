import { useState } from 'react';
import classNames from 'classnames';

import { Person } from '../types/Person';

interface Props {
  filteredPeople: Person[];
  value: string;
  setValue: (str: string) => void;
  setSelectedPerson: (person: Person | null) => void;
}

const Dropdown = ({
  filteredPeople,
  value,
  setValue,
  setSelectedPerson,
}: Props) => {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': focus,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            <div
              key={person.slug}
              className="dropdown-item"
              data-cy="suggestion-item"
              onMouseDown={e => {
                e.preventDefault();
                setValue(person.name);
                setSelectedPerson(person);
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
    </div>
  );
};

export default Dropdown;
