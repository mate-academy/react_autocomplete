import debounce from 'lodash.debounce';
import cn from 'classnames';

import React, { useMemo, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  onSelected?: (person: Person | null) => void,
  persons: Person[],
};

const FILTER_DELAY = 1000;

export const Dropdown: React.FC<Props> = ({
  onSelected = () => {},
  persons,
}) => {
  const [people] = useState<Person[]>(persons);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownShown, setIsDropdownShown] = useState(false);

  const filteredPeople: Person[] = useMemo(() => {
    return people
      .filter((person: Person) => {
        const name = person.name.trim().toUpperCase();
        const appliedQueryFiltered = appliedQuery.trim().toUpperCase();

        return name.includes(appliedQueryFiltered);
      });
  }, [appliedQuery, people]);

  const applyQuery = useMemo(() => debounce(
    setAppliedQuery, FILTER_DELAY,
  ), []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;

    if (!value) {
      onSelected(null);
    }

    setIsDropdownShown(true);
    setQuery(value);
    applyQuery(value);
  };

  const handlePersonClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();

    const personName = event.currentTarget.textContent || '';
    const person = filteredPeople.find(personItem => {
      return personItem.name === personName;
    });

    if (person) {
      onSelected(person);
    }

    setQuery(personName);
    applyQuery(personName);

    setIsDropdownShown(false);
  };

  return (
    <div
      className={cn('dropdown', {
        'is-active': isDropdownShown,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownShown(true)}
          onBlur={() => setIsDropdownShown(false)}
        />
      </div>

      {filteredPeople.length > 0 && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.map(person => {
              const { slug, name } = person;

              return (
                <div className="dropdown-item" key={slug}>
                  <a
                    href="/"
                    className="has-text-link"
                    onMouseDown={handlePersonClick}
                  >
                    {name}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
