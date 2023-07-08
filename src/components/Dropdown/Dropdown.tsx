import React, { useCallback, useMemo, useState } from 'react';
import './Dropdown.scss';
import cn from 'classnames';
import { debounce } from 'lodash';
import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem';

type Props = {
  people: Person[];
  setSelectedPerson: (person: Person | null) => void;
  delay: number;

};

export const Dropdown: React.FC<Props> = (
  {
    people,
    setSelectedPerson,
    delay,

  },
) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const applyDebouncedQuery = useCallback(
    debounce(setDebouncedQuery, delay),
    [],
  );

  const visiblePeople: Person[] = useMemo(() => (
    people.filter(
      ({ name }) => name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    )
  ), [debouncedQuery]);

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setSelectedPerson(null);
      setQuery(newQuery);
      applyDebouncedQuery(newQuery.trim());
    },
    [applyDebouncedQuery],
  );

  const handlePersonClick = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
      setQuery(person.name);
      setDebouncedQuery('');
    },
    [],
  );

  const handleResetQuery = useCallback(
    () => {
      setSelectedPerson(null);
      setQuery('');
      setDebouncedQuery('');
    },
    [],
  );

  return (
    <div className={
      cn(
        'dropdown',
        { 'is-active': !!debouncedQuery },
      )
    }
    >
      <div className="dropdown-trigger ">
        <div className="control has-icons-right ">
          <input
            type="text"
            className="input"
            placeholder="Enter a part of the name"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
          />

          {query && (
            <span className="icon is-right">
              <button
                type="button"
                className="delete"
                aria-label="close"
                onClick={handleResetQuery}
              />
            </span>
          )}
        </div>
      </div>

      <div
        className="dropdown-menu"
        role="menu"
      >
        <ul className="dropdown-content">
          {
            visiblePeople.length > 0 ? (
              visiblePeople.map((person) => (
                <DropdownItem
                  key={person.slug}
                  person={person}
                  onPersonClick={handlePersonClick}
                />
              ))
            ) : (
              <li className="dropdown-item">
                No match found
              </li>
            )
          }
        </ul>
      </div>
    </div>
  );
};
