import React, {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import './App.scss';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';
import { debounce } from './services/debounce';

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const filteredPerson = useMemo(() => {
    return peopleFromServer
      .filter(human => human.name.toLowerCase().includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setQuery(inputValue);
    debouncedQuery(inputValue);
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
