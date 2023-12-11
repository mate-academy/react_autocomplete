import { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({
  people,
  onSelected,
  delay,
}) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name.toLowerCase()
      .includes(query.toLowerCase()));
  }, [people, appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const textQuery = event.target.value;

    setQuery(textQuery);
    applyQuery(textQuery);
  };

  return (
    <div className={classNames('dropdown',
      { 'is-active': isDropdown })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsDropdown(true)}
          onBlur={() => setIsDropdown(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length ? filteredPeople.map(person => (
            <a
              className="dropdown-item"
              href="/"
              key={person.name}
              onMouseDown={() => {
                setQuery(person.name);
                onSelected(person);
              }}
            >
              {person.sex === 'm' ? (
                <p className="has-text-link">{person.name}</p>
              ) : (
                <p className="has-text-danger">{person.name}</p>
              )}
            </a>
          )) : (
            <div className="dropdown-item has-text-danger">
              No matching suggestions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
