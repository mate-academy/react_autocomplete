import cn from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  return (...args: unknown[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};

  const wrapper = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const inputWrapper = useCallback(
    debounce(setIsInputActive, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setIsInputActive(true);
    setQuery(value);
    wrapper(value);
    inputWrapper(false);
  };

  const visiblePeople = useMemo(() => {
    const trimmedLowerQuery = appliedQuery.trim().toLowerCase();

    return peopleFromServer.filter(person => {
      const lowerName = person.name.toLowerCase();

      return lowerName.includes(trimmedLowerQuery);
    });
  }, [peopleFromServer, appliedQuery]);

  const shouldShowDropdown = appliedQuery.trim().length > 0
    && !isInputActive && query.length > 0;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${name} (${born} = ${died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <div className="control has-icons-right">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={handleQueryChange}
            />

            {query && (
              <span
                className="icon is-right"
              >
                <button
                  type="button"
                  className="delete"
                  onClick={() => setQuery('')}
                  aria-label="Delete search"
                />
              </span>
            )}
          </div>
        </div>

        {shouldShowDropdown && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              { visiblePeople.length === 0
                ? (
                  <div className="dropdown-item">
                    <p>No matching suggestions</p>
                  </div>
                )
                : visiblePeople.map((person, index) => (
                  <button
                    type="button"
                    key={person.slug}
                    className={cn(
                      'dropdown-item button is-ghost',
                      {
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      },
                    )}
                    onClick={() => {
                      setSelectedPerson(person);
                      setQuery('');
                    }}
                    onKeyDown={() => {}}
                    tabIndex={index}
                  >
                    {person.name}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
