import React, { useState, useMemo, useCallback, ChangeEvent } from 'react';
import { Person } from '../types/Person';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { PersonList } from './PersonList';

type Props = {
  onSelected: (person: Person | null) => void;
  people: Person[];
  delay: number;
};

export const Dropdown: React.FC<Props> = ({ onSelected, people, delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const applyQueryCallback = debounce((value: string) => {
    setAppliedQuery(value);
  }, delay);

  const applyQuery = useCallback(applyQueryCallback, [applyQueryCallback]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setInputFocused(true);
    onSelected(null);
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setInputFocused(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setInputFocused(false);
    }, 300);
  };

  const focusInput = () => {
    setInputFocused(true);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.trim().toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people]);

  const isNotFound = !filteredPeople.length;

  return (
    <>
      <div className={cn('dropdown', { 'is-active': inputFocused })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleInputChange}
            onFocus={focusInput}
            onBlur={handleBlur}
            data-cy="search-input"
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {!isNotFound && (
            <PersonList
              handleSuggestionClick={handleSuggestionClick}
              people={filteredPeople}
            />
          )}
        </div>
      </div>

      {isNotFound && (
        <div
          className="notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
