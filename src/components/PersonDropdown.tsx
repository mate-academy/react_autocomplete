import debounce from 'lodash.debounce';
import classNames from 'classnames';

import React, { useState, useCallback, useMemo } from 'react';

import { Person } from '../types/Person';

type Props = {
  onSelect: (slug: string) => void,
  people: Person[],
  delay: number,
};

export const PersonDropdown: React.FC<Props> = ({
  onSelect, people, delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const applyQuery = useCallback(
    debounce((value: string) => {
      setAppliedQuery(value.trim());
    }, delay),
    [delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    applyQuery(value);
    setDropdownOpen(true);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(
      (person: Person) => person.name
        .toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people]);

  const handleClick = (
    slug: string,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    onSelect(slug);
    setDropdownOpen(false);
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
          onClick={() => setDropdownOpen(true)}
        />
      </div>
      {isDropdownOpen
        && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length
                ? (
                  filteredPeople.map(person => (
                    <a
                      key={person.slug}
                      href="/"
                      className={classNames('dropdown-item', {
                        'has-text-link': person.sex === 'f',
                        'has-text-danger': person.sex === 'm',
                      })}
                      onClick={(event) => handleClick(person.slug, event)}
                    >
                      {person.name}
                    </a>
                  ))
                ) : (
                  <div className="dropdown-content">
                    No matching suggestions
                  </div>
                )}
            </div>
          </div>
        )}
    </div>
  );
};
