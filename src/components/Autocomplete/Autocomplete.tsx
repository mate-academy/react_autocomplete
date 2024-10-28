import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  saveQuery: (query: string) => void;
  setSelectedPerson: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = React.memo(
  ({ people, inputRef, saveQuery, setSelectedPerson }) => {
    const [query, setQuery] = useState('');
    const [focus, setFocus] = useState(false);
    const divRef = useRef<HTMLDivElement | null>(null);

    const handleFocus = () => {
      setTimeout(() => setFocus(true), 100);
    };

    const handleBlur = () => {
      setTimeout(() => setFocus(false), 100);
    };

    return (
      <div className={classNames('dropdown', { 'is-active': inputRef })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onFocus={handleFocus}
            ref={inputRef}
            onChange={event => {
              const value = event.target.value;

              setQuery(value);
              saveQuery(value);
              setSelectedPerson(null);
            }}
            value={query}
          />
        </div>

        {focus && people.length > 0 && (
          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
            tabIndex={0}
            ref={divRef}
            onBlur={handleBlur}
          >
            <div className="dropdown-content">
              {people.map((person, index) => {
                const { name } = person;

                return (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={`person-${index}`}
                    onClick={() => {
                      setQuery(name);
                      saveQuery(name);
                      setSelectedPerson(person);
                    }}
                  >
                    <p className="has-text-link">{name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Autocomplete.displayName = 'Autocomplete';
