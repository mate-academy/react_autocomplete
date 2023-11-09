import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  delay: number,
  onSelect: (person:Person) => void
};

export const Dropdown: React.FC<Props> = ({ people, delay, onSelect }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useCallback(debounce((value:string) => {
    setAppliedQuery(value);
  }, delay), [delay]);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const handleSelect = (person:Person) => {
    setQuery(person.name);
    onSelect(person);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name.toLowerCase()
      .includes(appliedQuery.toLowerCase().trim()));
  }, [appliedQuery, people]);

  return (
    <div className={cn('dropdown', { 'is-active': isFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length
            ? (filteredPeople.map(person => (
              <a
                href="/"
                key={person.slug}
                className={cn('dropdown-item',
                  { 'has-text-link': person.sex === 'm' },
                  { 'has-text-danger': person.sex === 'f' })}
                onMouseDown={() => handleSelect(person)}
              >
                {person.name}
              </a>
            ))) : (<p className="dropdown-item">No matching suggestions</p>)}

        </div>
      </div>
    </div>
  );
};
