import classNames from 'classnames';
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
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [
    selectedPerson,
    setSelectedPerson,
  ] = useState<Person | null>(null);

  const applyQuery = useCallback(
    debounce(
      setAppliedQuery,
      1000,
    ), [],
  );

  useEffect(() => {
    setPeople(peopleFromServer);
    inputRef.current?.focus();
  }, []);

  const visiblePeople = useMemo(() => (
    people.filter((person) => person.name.toLocaleLowerCase().includes(
      appliedQuery.toLocaleLowerCase().trim(),
    ))
  ), [appliedQuery]);

  const handleOnclick = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery('');
  };

  return (
    <main className="section">
      <h1
        className="title"
      >
        {selectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : ('No selected person')}
      </h1>

      <div className={classNames(
        'dropdown',
        { 'is-active': appliedQuery },
      )}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              applyQuery(event.target.value);
            }}
            ref={inputRef}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {visiblePeople.map((person) => (
              <button
                type="button"
                className="dropdown-item"
                key={person.slug}
                onClick={() => handleOnclick(person)}
              >
                <p
                  className={classNames(
                    { 'has-text-link': person.sex === 'm' },
                    { 'has-text-danger': person.sex === 'f' },
                  )}
                >
                  {person.name}
                </p>
              </button>
            ))}
            {query && visiblePeople.length === 0 && (
              <p>No matching suggestions</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
