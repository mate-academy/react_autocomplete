import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';

import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

const toNormalizeQuery = (query: string) => query.trim().toLowerCase();

type Props = {
  onSelect: (person: Person) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({ onSelect, delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase());
    applyQuery(event.target.value.toLowerCase());
    setIsVisible(true);
  };

  const handleSelectedPerson = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();

    onSelect(person);
    setQuery(person.name);
    setIsVisible(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person: Person) => {
      return person.name.toLowerCase().includes(toNormalizeQuery(appliedQuery));
    });
  }, [appliedQuery]);

  return (
    <div className={cn('dropdown', {
      'is-active': isVisible,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsVisible(true)}
          onBlur={() => setIsVisible(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length ? (
            filteredPeople.map((person) => (
              <div className="dropdown-item">
                <a
                  href="/#"
                  key={person.name}
                  className={cn('button is-light', {
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  onMouseDown={(event) => handleSelectedPerson(event, person)}
                >
                  {person.name}
                </a>
              </div>
            ))
          ) : (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
