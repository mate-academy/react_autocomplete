import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay: number;
  onSelected: (person: Person | null) => void;
};

function debounce(
  callback: (query: string) => void,
  delay: number,
) {
  let timerId = 0;

  return (query: string) => {
    // debugger;
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(query);
    }, delay);
  };
}

export const Dropdown: React.FC<Props> = React.memo(({
  people,
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isActive, setIsActive] = useState(true);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      return person.name.toLowerCase().includes(appliedQuery);
    });
  }, [people, appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const correctQuery = event.target.value.trim().toLowerCase();

    setQuery(event.target.value);
    applyQuery(correctQuery);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setQuery(person.name);
    setAppliedQuery(person.name);
    onSelected(person);
    setIsActive(false);
  };

  return (
    <div className={classNames('dropdown', {
      'is-active': isActive,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.map(person => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <div
              className="dropdown-item"
              key={person.slug}
              onMouseDown={event => handleMouseDown(event, person)}
              role="listitem"
            >
              <p
                className={person.sex === 'm'
                  ? 'has-text-info'
                  : 'has-text-danger'}
              >
                {person.name}
              </p>
            </div>
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
