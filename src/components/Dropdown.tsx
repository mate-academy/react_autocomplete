import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  debounceDelay: number;
  onSelected: (person: Person) => void;
};

export const Dropdown: React.FC<Props> = React.memo(({
  people,
  onSelected,
  debounceDelay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, debounceDelay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      return person.name.includes(appliedQuery);
    });
  }, [people, appliedQuery]);

  const onMouseDown = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setQuery(person.name);
    setAppliedQuery(person.name);
    onSelected(person);
    setShowDropdown(false);
  };

  return (
    <div className={classNames('dropdown', {
      'is-active': showDropdown,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setShowDropdown(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content has-text-link">
          {filteredPeople.map(person => (
            <a
              href="/"
              key={person.slug}
              className="dropdown-item"
              onMouseDown={(event) => onMouseDown(event, person)}
            >
              <p
                className={person.sex === 'm'
                  ? 'has-text-info'
                  : 'has-text-danger'}
              >
                {person.name}
              </p>
            </a>
          ))}

          {filteredPeople.length === 0 && (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
