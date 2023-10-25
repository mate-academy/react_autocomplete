import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  setSelectedPerson: (person: Person | null) => void;
};

const DELAY = 1000;

export const DropdownMenu: React.FC<Props> = ({ setSelectedPerson }) => {
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople = useMemo(
    () => peopleFromServer.filter((person: Person) => person.name
      .toLowerCase().includes(appliedQuery.toLowerCase().trim())),
    [appliedQuery],
  );

  const applyQuery = useCallback(debounce(setAppliedQuery, DELAY), []);

  const handleDropdownChange = (person: Person) => {
    setSelectedPerson(person);
    setQuery('');
    setAppliedQuery('');
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsMenuShown(true)}
          onBlur={() => setIsMenuShown(false)}
        />
      </div>

      {isMenuShown && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length === 0 ? (
              <div className="dropdown-item">No matching suggestions</div>
            ) : (
              filteredPeople.map((person) => (
                <div className="dropdown-item" key={person.slug}>
                  <a
                    href="/#"
                    className={cn('has-text-link', {
                      'has-text-danger': person.sex === 'f',
                    })}
                    onMouseDown={() => handleDropdownChange(person)}
                  >
                    {person.name}
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
