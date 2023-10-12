import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [query, setQuery] = useState('');
  const [chooseHuman, setChooseHuman] = useState('No Selected person');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const filteredPeople = useMemo(() => {
    const people = [...peopleFromServer];

    return people.filter(
      human => human.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const applyQuery = useCallback(
    debounce(setQuery, 1000),
    [],
  );

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const applyFocused = useCallback(
    debounce(setIsInputFocused, 500),
    [],
  );

  const handleInputBlur = () => {
    applyFocused(false);
  };

  const handleChangeInput = (event: {
    target: {
      value: React.SetStateAction<string>;
    };
  }) => {
    setInputText(event.target.value);
    applyQuery(event.target.value);
    // setChooseHuman('No Selected person');
    // setIsInputFocused(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {chooseHuman}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputText}
            onChange={handleChangeInput}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>
        {isInputFocused && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <ul>
                {filteredPeople.map(human => (
                  <li
                    key={human.slug}
                  >
                    <button
                      type="button"
                      className={classNames('dropdown-item', { 'has-background-info': chooseHuman === `${human.name} (${human.born} - ${human.died})` })}
                      onClick={() => setChooseHuman(`${human.name} (${human.born} - ${human.died})`)}
                    >
                      <p className="has-text-link">{human.name}</p>
                    </button>
                  </li>
                ))}
              </ul>
              {filteredPeople.length === 0 && (
                <div>No matching suggestions</div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
