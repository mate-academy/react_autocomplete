import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  setSelectedPerson: (person: Person) => void;
};

const DELAY = 1000;

export const DropdownMenu: React.FC<Props> = ({ setSelectedPerson }) => {
  const [showUserList, setShowUserList] = useState(false);
  const [query, setQuery] = useState('');
  const [aplliedQuery, setAplliedQuery] = useState('');

  const filteredPeople = useMemo(
    () => peopleFromServer.filter((person: Person) => person.name
    // eslint-disable-next-line @typescript-eslint/indent
    .toLowerCase().includes(aplliedQuery.toLowerCase().trim())), [aplliedQuery],
  );

  const applyQuery = useCallback(
    debounce((value: string) => {
      setAplliedQuery(value);
      setShowUserList(true);
    }, DELAY), [setAplliedQuery, setShowUserList],
  );

  const handleUserSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAplliedQuery('');
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setShowUserList(false);
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
          onFocus={() => setShowUserList(true)}
          onBlur={() => setShowUserList(false)}
        />
      </div>

      {showUserList && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {!filteredPeople.length ? (
              <div className="dropdown-item">No matching suggestions</div>
            ) : (
              filteredPeople.map((person) => (
                <div className="dropdown-item" key={person.slug}>
                  <a
                    href="/#"
                    className={cn('has-text-link', {
                      'has-text-danger': person.sex === 'f',
                    })}
                    onMouseDown={() => handleUserSelect(person)}
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
