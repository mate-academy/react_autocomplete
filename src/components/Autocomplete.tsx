import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';

import { Person } from '../types/Person';

type Props = {
  peopleFromServer: Person[];
  onSelect?: (person: Person) => void;
};

function getPreparedPeople(initialPeople: Person[], query?: string) {
  if (!query) {
    return initialPeople;
  }

  const preparedQuery = query.toLowerCase();

  return initialPeople.filter(person => (
    person.name
      .toLowerCase()
      .includes(preparedQuery)
  ));
}

export const Autocomplete: React.FC<Props> = ({
  peopleFromServer,
  onSelect = () => {},
}) => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isPersonHovered, setIsPersonHovered] = useState(false);

  const selectPerson = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();

    onSelect(person);
    setSearchQuery(person.name);
    setIsDropdownActive(false);
  };

  const preparedPeople = useMemo(() => {
    return getPreparedPeople(peopleFromServer, appliedQuery);
  }, [appliedQuery, peopleFromServer]);

  const applySearchQuery = useMemo(() => {
    return debounce(setAppliedQuery, 1000);
  }, []);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    applySearchQuery(event.target.value);
  };

  const handleBlur = () => (
    isPersonHovered ? setIsDropdownActive(true) : setIsDropdownActive(false)
  );

  return (
    <div className={cn('dropdown', { 'is-active': isDropdownActive })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={searchQuery}
          onChange={handleChangeInput}
          onBlur={handleBlur}
          onFocus={() => setIsDropdownActive(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {preparedPeople.length > 0 ? (
            preparedPeople.map((person) => (
              <a
                className="dropdown-item"
                key={person.slug}
                href="#/"
                onClick={(event) => selectPerson(event, person)}
                onMouseLeave={() => setIsPersonHovered(false)}
                onMouseEnter={() => setIsPersonHovered(true)}
              >
                <p
                  className={cn({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </a>
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
