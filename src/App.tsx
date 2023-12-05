import React, { useState, useMemo, useCallback } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';

function debounce(callback: (param: string) => void,
  delay: number): (param: string) => void {
  const timerID = 0;

  return (...args) => {
    window.clearTimeout(timerID);
    window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [name, setName] = useState('');
  const [born, setBorn] = useState(0);
  const [died, setDied] = useState(0);
  const [valueApplied, setValueApplied] = useState('');
  const [focus, setFocus] = useState(false);
  const applyValue = useCallback(
    debounce(setValueApplied as () => void, 1000),
    [valueApplied],
  );

  const onFocus = () => {
    setFocus(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    applyValue(e.target.value);
  };

  const handleItemChange = (person: string) => {
    const findPerson = peopleFromServer.find((p) => p.name === person);

    setValue(person);
    setName(findPerson?.name || '');
    setBorn(findPerson?.born || 0);
    setDied(findPerson?.died || 0);
  };

  const filteredPosts = useMemo(() => {
    return peopleFromServer
      .filter((person) => person.name.toLowerCase()
        .includes(valueApplied.toLowerCase()))
      .map((person) => person);
  }, [valueApplied]);

  return (
    <main className="section">
      <h1 className="title">
        {!name ? `${name} (${born} = ${died})` : 'No selected person'}
      </h1>

      <div className={cn('dropdown', {
        'is-active': focus
          && value === valueApplied,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={value}
            onFocus={onFocus}
            onChange={handleInputChange}

          />
        </div>
        {
          focus && (
            <div className="dropdown-menu" role="menu">
              <div className="dropdown-content">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((person) => (
                    <div
                      key={person.slug}
                      className="dropdown-item"
                    >
                      <button
                        type="button"
                        className="has-text-link"
                        onClick={() => handleItemChange(person.name)}
                      >
                        {person.name}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">
                    <p className="has-text-link">No matching suggestions</p>
                  </div>
                )}

              </div>
            </div>
          )
        }
      </div>
    </main>
  );
};
