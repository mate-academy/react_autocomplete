import React, { useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const queryApplyTimeout = 300;
  const peopleCopy = useMemo(() => {
    return [...peopleFromServer];
  }, []);
  const [selectedHuman, setSelectedHuman] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [inputIsActive, setInputIsActive] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const inputField = useRef<HTMLInputElement>(null);
  const handleFocus = () => setInputIsActive(true);
  const handleBlur = () => setInputIsActive(false);

  const applyQuery = useMemo(
    () =>
      debounce((value: string) => setAppliedQuery(value), queryApplyTimeout),
    [queryApplyTimeout],
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!peopleCopy.some(human => human.name === e.target.value)) {
      setSelectedHuman(null);
    } else {
      setSelectedHuman(
        peopleCopy.find(human => human.name === e.target.value) || null,
      );
    }

    if (e.target.value.trim() !== '') {
      setQuery(e.target.value);
      applyQuery(e.target.value);
    } else {
      setQuery('');
      applyQuery('');
    }
  };

  const filteredPeople = useMemo(() => {
    return peopleCopy.filter(human =>
      human.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, peopleCopy]);

  const handleSelect = (nameProp: string) => {
    setQuery(nameProp);
    setInputIsActive(false);
    setSelectedHuman(peopleCopy.find(human => human.name === nameProp) || null);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedHuman !== null
            ? `${selectedHuman?.name} (${selectedHuman?.born} - ${selectedHuman?.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query}
              onChange={e => handleQueryChange(e)}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              ref={inputField}
              onFocus={() => handleFocus()}
              onBlur={() => handleBlur()}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {filteredPeople.length !== 0 && inputIsActive && (
              <div className="dropdown-content">
                {filteredPeople.map((human, index) => (
                  <div
                    className={'dropdown-item'}
                    data-cy="suggestion-item"
                    key={human.name}
                    onMouseDown={() => handleSelect(human.name)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <p
                      className={`has-text-link' ${
                        hoveredIndex === index ? 'has-text-danger' : ''
                      }`}
                    >
                      {human.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {filteredPeople.length === 0 && (
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
