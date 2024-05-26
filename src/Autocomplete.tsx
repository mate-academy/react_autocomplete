import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

type Props = {
  onSelect: (peoples: Person | '') => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = React.memo(({
  onSelect,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [active, setActive] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    onSelect('');
  };

  const handleSelect = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
  };

  const filteredList = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name
        .toLocaleLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  return (
    <div className={classNames('dropdown', { 'is-active': active })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
        />
        {filteredList.length === 0 && (
          <p>No matching suggestions</p>
        )}
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredList.map(person => (
            <a
              href="/"
              className="dropdown-item"
              key={person.slug}
              onMouseDown={() => handleSelect(person)}
            >
              <p className="has-text-link">
                {person.name}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});
