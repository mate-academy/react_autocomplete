import React, { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect?: (person: Person | null) => void;
  delay: number
};

export const DropDown: React.FC<Props> = React.memo(({
  people,
  onSelect = () => { },
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [apliedQuery, setApliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = debounce(setApliedQuery, delay);

  const visiblePeople = useMemo(() => (people.filter(person => {
    const normalizedQuery = apliedQuery.trim().toLowerCase();

    return person.name.trim().toLowerCase().includes(normalizedQuery);
  })), [apliedQuery, people]);

  const resultToShow = (visiblePeople.length > 0);

  const isPeopleListShown = resultToShow && isFocused;

  const queryHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const selectHander = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();
    onSelect(person);
    setIsFocused(false);
    setQuery(person.name);
  };

  const resetHandler = () => {
    onSelect(null);
    setQuery('');
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <div className="control has-icons-right">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={queryHandler}
            onClick={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {query && (
            <span className="icon is-right">
              <button
                type="button"
                aria-label="close"
                className="delete is-medium"
                onClick={resetHandler}
              />
            </span>
          )}
        </div>
      </div>

      <div className="dropdown-menu" role="menu">
        {isPeopleListShown && (
          <div className="dropdown-content">
            {visiblePeople.map(person => {
              const {
                slug,
                sex,
                name,
              } = person;

              return (
                <a
                  href={`#${slug}`}
                  className="dropdown-item"
                  key={slug}
                  onMouseDown={(event) => selectHander(event, person)}
                >
                  <p className={cn({
                    'has-text-link': sex === 'm',
                    'has-text-danger': sex === 'f',
                  })}
                  >
                    {name}
                  </p>
                </a>
              );
            })}
          </div>
        )}

        {!resultToShow && (<div>No matching suggestions</div>)}
      </div>
    </div>
  );
});
