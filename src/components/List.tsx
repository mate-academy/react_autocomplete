import React, { useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  delay: number,
  onSelect: (person: Person | null) => void,
};

export const List: React.FC<Props> = ({ people, delay, onSelect }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [visibleList, setVisibleList] = useState(false);

  const applyQuery = React.useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const filteredPeople = React.useMemo(() => {
    return people.filter(person => (
      person.name.toLowerCase().includes(appliedQuery.toLowerCase())
    ));
  }, [people, appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    setVisibleList(true);
  };

  return (
    <div className={cn('dropdown',
      { 'is-active': visibleList })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setVisibleList(true)}
          onBlur={() => setVisibleList(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length ? (
            filteredPeople.map(person => (
              <div className="dropdown-item" key={person.slug}>
                <a
                  href="/"
                  onMouseDown={() => {
                    onSelect(person);
                    setQuery(person.name);
                  }}
                  className={cn('dropdown-item', {
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </a>
              </div>
            ))
          ) : (
            <p>No matching suggestions</p>
          )}
        </div>
      </div>
    </div>
  );
};
