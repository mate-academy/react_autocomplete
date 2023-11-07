import React, { useState } from 'react';
import cl from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  delay: number,
  onSelected: (person: Person | null) => void,
};

export const Autocomplete: React.FC<Props> = ({ delay, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = React.useCallback(debounce(
    setAppliedQuery, delay,
  ), [delay]);

  const hasDropdown = React.useMemo(() => {
    return query === appliedQuery;
  }, [query, appliedQuery]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const handlePersonClick = React.useCallback((personName: string) => {
    onSelected(peopleFromServer
      .find(person => person.name === personName) || null);
    setQuery(personName);
  }, []);

  const visiblePeople = React.useMemo(() => {
    const people = [...peopleFromServer];

    return people.filter(person => person.name.toLocaleLowerCase()
      .includes(appliedQuery.toLocaleLowerCase()));
  }, [peopleFromServer, appliedQuery]);

  return (
    <div className={cl('dropdown', { 'is-active': query })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
        />
      </div>

      {hasDropdown && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {visiblePeople.length
              ? visiblePeople.map(person => (
                <button
                  type="button"
                  key={person.name}
                  className="button dropdown-item"
                  onClick={() => handlePersonClick(person.name)}
                >
                  {person.name}
                </button>
              )) : (
                <div className="dropdown-item">
                  <p className="has-text">No matching suggestions</p>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
