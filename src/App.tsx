import cn from 'classnames';
import React, { useCallback, useState } from 'react';
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

  const visiblePeople = peopleFromServer.filter(person => {
    const lowerName = person.name.toLowerCase();

    return lowerName.includes(appliedQuery.trim().toLowerCase());
  });

  const shouldShowDropdown = appliedQuery.trim().length > 0
  && visiblePeople.length > 0 && !isInputActive;

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${name} (${born} = ${died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        {shouldShowDropdown && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              { visiblePeople.map((person, index) => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedPerson(person);
                    setQuery(person.name);
                  }}
                  onKeyDown={() => {}}
                  role="link"
                  tabIndex={index}
                >
                  <p
                    className={cn({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
