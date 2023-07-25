import React, { useMemo, useState, useCallback } from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';
import { debounce } from './services/debounce';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person>();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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
      setIsFocused(false);
    }, 200);
  };

  return (
    <main className="section">
      <h1 className="title">
        {person
          ? `${person.name} (${person.born} - ${person.died})`
          : 'No selected person'}
      </h1>

      <div
        className={classNames('dropdown', {
          'is-active': isFocused,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
          />
        </div>
        {filteredPerson.length === 0 && (
          <p className="has-text-danger">&nbsp; No matching suggestions</p>
        )}

        <PeopleList
          people={filteredPerson}
          onSelected={setPerson}
          setIsFocused={setIsFocused}
          setQuery={setQuery}
        />
      </div>
    </main>
  );
};
