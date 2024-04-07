import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const useDebounce = (query: string, delay: number) => {
  const timerId = useRef(0);

  const [delayedQuery, setDelayedQuery] = useState('');

  useEffect(() => {
    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setDelayedQuery(query);
    }, delay);
  }, [query]);

  return delayedQuery;
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const queryDebounce = useDebounce(query, 1000);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      return person.name.toLowerCase().includes(queryDebounce.toLowerCase());
    });
  }, [queryDebounce]);

  const handleChangeQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setSelectedPerson(null);
    },
    [],
  );

  const handleSelectPerson = useCallback(
    (person: Person) => () => {
      setSelectedPerson(person);
      setQuery(person.name);
    },
    [],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleChangeQuery}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 100)}
            />
          </div>

          {!selectedPerson && filteredPeople.length && isInputFocused ? (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.name}
                    onClick={handleSelectPerson(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {!filteredPeople.length && (
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
