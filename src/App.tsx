import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import debounce from 'lodash.debounce';

import 'bulma';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './DropdownMenu';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);

  const [text, setText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [appliedQuery, setAppliedQuery] = useState('');

  const testDebounce = useCallback(debounce(setAppliedQuery, 300), []);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    testDebounce(event.target.value);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const onSelected = (user: Person) => {
    setText(user.name);
    setShowSuggestions(false);
    setPerson(user);
  };

  const people = useMemo(() => {
    return peopleFromServer.filter(user =>
      user.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {person
            ? `${person.name} (${person.born} - ${person.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active" ref={dropdownRef}>
          <div className="dropdown-trigger">
            <input
              type="text"
              className="input"
              data-cy="search-input"
              value={text}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Enter a part of the name"
            />
          </div>

          {showSuggestions && people.length !== 0 && (
            <DropdownMenu list={people} onSelected={onSelected} />
          )}
        </div>

        {showSuggestions && people.length === 0 && (
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
      </main>
    </div>
  );
};
