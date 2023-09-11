import React, { useState, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import { Person } from '../types/Person';

type Props = {
  people: Person[];
  selectedPerson: Person | null;
  onSelect?: (person: Person) => void;
  delay: number
};

export const DropDown: React.FC<Props> = React.memo(({
  people,
  selectedPerson,
  onSelect = () => {},
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [apliedQuery, setApliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(true);

  const applyQuery = useCallback(debounce(setApliedQuery, delay), []);

  const visiblePeople = useMemo(() => (people.filter(person => {
    const normalizedQuery = apliedQuery.trim().toLowerCase();

    return person.name.trim().toLowerCase().includes(normalizedQuery);
  })), [apliedQuery, people]);

  const resultToShow = (visiblePeople.length > 0);

  const isPeopleListShown = !selectedPerson
  && resultToShow
  && isFocused;

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
    setQuery('');
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={queryHandler}
          onClick={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={selectedPerson !== null}
        />
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
