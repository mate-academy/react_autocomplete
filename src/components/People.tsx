import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';

import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
};

export const People: React.FC<Props> = ({
  people,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isBoolean, setIsBoolean] = useState(false);

  const applyQuery = useCallback(
    debounce(
      setAppliedQuery,
      700,
    ),
    [],
  );

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    onSelected(null);
  };

  const handleSelected = (person: Person) => {
    setQuery(person.name);
    setIsBoolean(false);
    onSelected(person);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  return (
    <div className={classNames('dropdown', {
      'is-active': isBoolean,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleInput}
          onFocus={() => setIsBoolean(true)}
          onBlur={() => setIsBoolean(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length > 0
            ? (filteredPeople.map((person) => (
              <button
                key={person.slug}
                className={classNames('dropdown-item', {
                  'has-text-danger': person.sex === 'f',
                })}
                type="button"
                onMouseDown={() => handleSelected(person)}
              >
                {person.name}
              </button>
            ))
            ) : (
              <p>No matching suggestion</p>
            )}
        </div>
      </div>
    </div>
  );
};
