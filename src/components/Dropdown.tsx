import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  debounceDelay: number;
  onSelected: (person: Person) => void;
};

function debounce(
  callback: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(args);
    }, delay);
  };
}

export const Dropdown: React.FC<Props> = React.memo(({
  people,
  onSelected,
  debounceDelay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isShown, setIsShown] = useState(false);

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

  const handleMouseDown = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setQuery(person.name);
    setAppliedQuery(person.name);
    onSelected(person);
    setIsShown(false);
  };

  return (
    <div className={classNames('dropdown', {
      'is-active': isShown,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsShown(true)}
          onBlur={() => setIsShown(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content has-text-link">
          {filteredPeople.map(person => (
            <a
              href="/"
              key={person.slug}
              className="dropdown-item"
              onMouseDown={(event) => handleMouseDown(event, person)}
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
