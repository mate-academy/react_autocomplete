import { useState } from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  query: string;
  applyQuery: (query: string) => void;
};

export const Dropdown: React.FC<Props> = ({ people, applyQuery }) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const [hoverActive, setHoverActive] = useState(false);

  return (
    <div className={cn('dropdown', { 'is-active': dropdownActive })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onFocus={() => setDropdownActive(!dropdownActive)}
          onChange={(event) => {
            applyQuery(event.target.value);
          }}
          onBlur={() => setDropdownActive(!dropdownActive)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {people.map((person) => (
            <div
              key={person.name}
              className="dropdown-item"
              onMouseEnter={() => setHoverActive(!hoverActive)}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
