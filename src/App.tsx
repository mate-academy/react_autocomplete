import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPerson(null);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filtredPeople = useMemo(() => {
    const lowerCaseQuery = appliedQuery.toLocaleLowerCase();

    return [...peopleFromServer].filter(p =>
      p.name.toLowerCase().includes(lowerCaseQuery),
    );
  }, [appliedQuery]);

  const onSelected = useCallback((person: Person) => {
    setCurrentPerson(person);
    setQuery(person.name);
    setIsFocused(false);
  }, []);

  const focusedInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusedInput.current) {
      focusedInput.current.focus();
    }
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {currentPerson
            ? `${currentPerson.name} (${currentPerson.born} - ${currentPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsFocused(true)}
              ref={focusedInput}
            />
          </div>

          <Autocomplete
            people={filtredPeople}
            isFocused={isFocused}
            onSelect={onSelected}
          />
        </div>

        {!filtredPeople.length && (
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
