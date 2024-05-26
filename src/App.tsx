import './App.scss';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList';

const DELAY = 300;

export const App: React.FC = () => {
  const dropRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [touched, setTouched] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, DELAY), []);

  const normalizeQuery = appliedQuery.trim().toLowerCase();

  const filteredPeople = useMemo(
    () =>
      peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(normalizeQuery),
      ),
    [normalizeQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleClick = (event: MouseEvent) => {
    if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
      setTouched(false);
    }
  };

  const activateTitle = (person: Person) => () => {
    setSelected(person);
    setQuery(person.name);
    setTouched(false);
  };

  useEffect(() => {
    if (selected?.name !== query) {
      setSelected(null);
    }
  }, [query, selected]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <div
          className={cn('dropdown', {
            'is-active': touched,
          })}
          ref={dropRef}
        >
          <div className="dropdown-trigger">
            <input
              onFocus={() => setTouched(true)}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
            />
          </div>
          <PeopleList people={filteredPeople} activateTitle={activateTitle} />
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
