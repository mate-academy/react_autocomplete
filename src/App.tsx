import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

function debounce<T>(callback: (value: T) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>;

  return (value: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(value);
    }, delay);
  };
}

type Props = {
  delay?: number;
  onSelected?: (person: Person | null) => void;
};

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [selectedPeople, setSelectedPeople] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [input, setInput] = useState<string>('');

  const filteredPeoples = useMemo(
    () =>
      peopleFromServer.filter(ppl => ppl.name.toLowerCase().includes(query)),
    [query],
  );
  const isEmpty = filteredPeoples.length === 0;

  const applyFilter = useMemo(
    () => debounce((val: string) => setQuery(val), delay),
    [delay],
  );

  const handleSelect = useCallback(
    (ppl: Person) => {
      setSelectedPeople(ppl);
      setIsFocused(false);
      setInput(ppl.name);
      onSelected?.(ppl);
    },
    [onSelected],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const trimVal = e.target.value.trim().toLowerCase();

      setInput(e.target.value);
      setSelectedPeople(null);
      onSelected?.(null);

      if (trimVal === '' || trimVal === query) {
        return;
      }

      applyFilter(trimVal);
    },
    [query, applyFilter, onSelected],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPeople
            ? `${selectedPeople.name} (${selectedPeople.born} - ${selectedPeople.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={input}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={e => handleInputChange(e)}
              data-cy="search-input"
            />
          </div>

          <div
            className={`dropdown-menu ${isFocused && !isEmpty ? '' : 'is-hidden'}`}
            role="menu"
            data-cy="suggestions-list"
          >
            <div className="dropdown-content">
              {filteredPeoples.map(ppl => (
                <div
                  key={ppl.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => handleSelect(ppl)}
                >
                  <p className="has-text-link">{ppl.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isEmpty && (
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
