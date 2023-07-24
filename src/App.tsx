import React, { useMemo, useState, useCallback } from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';

function debounce(callback: (...args: string[]) => void, delay: number) {
  let timerId = 0;

  return (...args: string[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person>();
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(false);

  const applyQuery = useCallback(debounce(setQuery, 1000), []);

  const filteredPerson = useMemo(() => {
    return peopleFromServer
      .filter(human => human.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setFocus(false);
    }, 200);
  };

  return (
    <main className="section">
      <h1 className="title">
        {!person && (
          'No selected person'
        )}
        {person && (
          `${person.name} (${person.born} - ${person.died})`
        )}
      </h1>

      <div
        className={classNames('dropdown', {
          'is-active': focus,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setFocus(true)}
            onBlur={handleBlur}
          />
        </div>
        {filteredPerson.length === 0 && (
          <p className="has-text-danger">&nbsp; No matching suggestions</p>
        )}

        <PeopleList
          people={filteredPerson}
          onSelected={setPerson}
          setFocus={setFocus}
          setQuery={setQuery}
        />
      </div>
    </main>
  );
};
