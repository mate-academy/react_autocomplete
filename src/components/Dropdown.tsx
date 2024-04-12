/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react';
import { Person } from '../types/Person';
import cn from 'classnames';
import debounce from 'lodash.debounce';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
  selectedPerson: Person | null;
};

export const Dropdown: React.FC<Props> = ({
  people,
  onSelected,
  delay,
  selectedPerson,
}) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [search, setSearch] = useState('');

  const shownPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase().trim()),
    );
  }, [query, people]);

  const applySearch = useMemo(
    () => debounce(setQuery, delay),
    [setQuery, delay],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    applySearch(e.target.value);
    setIsActive(true);
    onSelected(null);
  };

  const handleSelectedPeople = (person: Person) => {
    setSearch(person.name);
    onSelected(person);
    setIsActive(false);
  };

  const handleCancelValue = () => {
    setSearch('');
    applySearch('');
    onSelected(null);
  };

  return (
    <>
      <div className={cn('dropdown', { 'is-active': isActive })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          />
          {search === selectedPerson?.name && (
            <button
              className="delete is-small"
              onClick={handleCancelValue}
            ></button>
          )}
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className={cn({ 'dropdown-content': shownPeople.length !== 0 })}>
            {shownPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onMouseDown={() => handleSelectedPeople(person)}
              >
                <p
                  className={cn({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!shownPeople.length && (
        <div
          className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start
            "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
