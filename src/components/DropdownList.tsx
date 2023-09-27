import React, { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  onSelect: (person: Person | null) => void;
  people: Person[];
  delay?: number
};

export const DropdownList: React.FC<Props> = ({ onSelect, people, delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isShown, setIsShown] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [delay],
  );

  const filteredPeople = useMemo(() => {
    const normalizedQuery = appliedQuery.toLowerCase().trim();

    return people.filter((person) => person.name
      .toLowerCase()
      .includes(normalizedQuery));
  }, [people, appliedQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    onSelect(null);
  };

  const handlePersonSelect = (person: Person) => {
    setQuery(person.name);
    setIsShown(false);
    onSelect(person);
  };

  return (
    <div className={cn('dropdown', {
      'is-active': isShown,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsShown(true)}
          onBlur={() => setIsShown(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length > 0 ? (
            filteredPeople.map((person) => (
              <a
                href="/"
                className="dropdown-item"
                key={person.slug}
                onMouseDown={() => handlePersonSelect(person)}
              >
                {person.name}
              </a>
            ))
          ) : (
            <p>No matching suggestions</p>
          )}
        </div>
      </div>
    </div>
  );
};
