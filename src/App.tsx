import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { List } from './List';

function debounce(callback: any, delay: number) {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

interface AppProps {
  delay: number
}

export const App: React.FC<AppProps> = ({ delay }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Person | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const appRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appRef.current && !appRef.current.contains(event.target as Node)) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [appRef]);

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setSelected(null);
    setQuery(inputValue);
    applyQuery(inputValue);
  };

  const listFilter = useMemo(() => {
    return peopleFromServer.filter((people) => {
      return people.name.toLowerCase()
        .includes(appliedQuery.toLowerCase().trim());
    });
  }, [appliedQuery]);

  return (
    <main className="section" ref={appRef}>
      <h1 className="title">
        {selected ? `${selected.name} (${selected.born} = ${selected.died})` : 'No matching suggestions'}
      </h1>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={selected ? selected.name : query}
            onChange={onChange}
            onFocus={handleFocus}
          />
        </div>

        {isInputFocused && !selected && (
          <List
            filteredList={listFilter}
            onSelected={setSelected}
          />
        )}
      </div>
    </main>
  );
};
