import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

type Props = {
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const DropdownList: React.FC<Props> = ({
  onSelected,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const showDropdownList = () => setIsFocused(true);
  const hideDropdownList = () => setTimeout(() => setIsFocused(false), 500);

  const filteredPerson = useMemo(() => {
    return (peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase())));
  }, [appliedQuery]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value), delay),
    [setAppliedQuery, delay],
  );

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsDropdownOpen(true);
    onSelected(null);
  };

  const handleSelectPerson = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();

    setIsFocused(true);
    setQuery(person.name);
    onSelected(person);
  };

  return (
    <div className={cn('dropdown', {
      'is-active': isFocused && isDropdownOpen,
    })}
    >
      <div className="dropdown-trigger">
        <input
          name="person"
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={showDropdownList}
          onBlur={hideDropdownList}
        />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            { !filteredPerson.length
              ? (
                <div className="dropdown-item">
                  No matching suggestions
                </div>
              )
              : (
                filteredPerson.map((person) => (
                  <a
                    key={person.name}
                    href="/"
                    className={cn('dropdown-item', {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={(event) => handleSelectPerson(event, person)}
                  >
                    {person.name}
                  </a>
                ))
              )}
          </div>
        </div>
      )}
    </div>
  );
};
