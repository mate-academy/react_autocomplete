/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { peopleFromServer } from '../data/people';
import { DropdownList } from './DropdownList';
import { Person } from '../types/Person';

type Props = {
  onSelected: (person: Person) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({ onSelected, delay }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [visiblePersons, setVisiblePersons] = useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const appliedQuery = useCallback(debounce(setDebouncedQuery, delay), []);

  const cleanQuery = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setShowSuggestions(false);
  }, []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);
    appliedQuery(newQuery);
    setShowSuggestions(false);
  };

  const selectPerson = useCallback(
    (person: Person) => {
      onSelected(person);
      cleanQuery();
    },
    [onSelected, cleanQuery],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisiblePersons(
        peopleFromServer.filter((person) => person.name
          .toUpperCase().includes(debouncedQuery.toUpperCase())),
      );
      setShowSuggestions(debouncedQuery !== '');
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [debouncedQuery]);

  return (
    <div
      className={
        classNames(
          'dropdown',
          { 'is-active': showSuggestions },
        )
      }
    >
      <div className="dropdown-trigger">
        <div className="control has-icons-right">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />

          {query && (
            <span className="icon is-right">
              <button
                type="button"
                className="delete"
                onClick={cleanQuery}
              />
            </span>
          )}
        </div>

        {showSuggestions && (
          <DropdownList
            onSelected={selectPerson}
            visiblePersons={visiblePersons}
          />
        )}
      </div>
    </div>
  );
};
