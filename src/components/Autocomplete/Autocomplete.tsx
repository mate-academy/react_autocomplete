import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';

type Props = {
  peopleFromServer: Person[],
  onSelect?: (person: Person | null) => void,
  delay: number,
};

export const Autocomplete: React.FC<Props> = (({
  peopleFromServer,
  onSelect = () => { },
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focus, setFocus] = useState(false);

  const applyQuery
    = useMemo(() => debounce(setAppliedQuery, delay), [setAppliedQuery, delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPersons = useMemo(() => {
    return peopleFromServer.filter(person => person.name.toLowerCase()
      .includes(appliedQuery));
  }, [appliedQuery, peopleFromServer]);

  return (
    <div className={cn('dropdown', {
      'is-active': focus,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setFocus(true)}
        // onBlur={() => setFocus(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPersons.length === 0 ? (
            <div className="dropdown-item">
              No matching suggestions
            </div>
          ) : (
            filteredPersons.map(person => (
              <div
                key={person.slug}
                className={cn('dropdown-item', {
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
                onClick={() => {
                  onSelect(person);
                  setFocus(false);
                  setQuery(person.name);
                  applyQuery(person.name);
                }}
                onKeyDown={() => onSelect(person)}
                role="tab"
                tabIndex={0}
              >
                {`${person.name}`}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});
