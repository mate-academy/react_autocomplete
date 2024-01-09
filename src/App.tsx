import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isfocused, setIsfocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [isListVisible, setIsListVisible] = useState(true);

  const filteredPeople = useMemo(() => {
    return peopleFromServer
      .filter(person => person.name.toLowerCase().includes(
        appliedQuery.toLowerCase(),
      ));
  }, [appliedQuery]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce((value) => {
    setAppliedQuery(value);
    setIsListVisible(true);
  }, 1000),
  []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsListVisible(false);
    applyQuery(event.target.value);
  };

  const handleClick = (name: string) => {
    setQuery(name);

    const filterdPerson: Person | undefined
      = peopleFromServer.find(person => person.name === name);

    setSelectedPerson(filterdPerson);
  };

  const handleMouseDown = (
    (event: React.KeyboardEvent<HTMLDivElement>, name: string) => {
      if (event.key === 'Enter') {
        handleClick(name);
      }
    });

  return (
    <main className="section">
      {selectedPerson
        ? (
          <h1 className="title">
            {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
          </h1>
        )
        : (<h1 className="title">No selected person</h1>)}

      <div className={cn('dropdown', { 'is-active': isfocused })}>
        <div className="dropdown-trigger">
          <input
            value={query}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleQueryChange}
            onFocus={() => setIsfocused(true)}
            onBlur={() => setIsfocused(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">

            {isListVisible && (
              filteredPeople.length > 0
                ? (filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    key={person.name}
                    onMouseDown={() => handleClick(person.name)}
                    onKeyDown={(event) => handleMouseDown(event, person.name)}
                    role="button"
                    tabIndex={0}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                )))
                : (
                  <div className="dropdown-item">
                    <p>No matching suggestions</p>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </main>
  );
};
