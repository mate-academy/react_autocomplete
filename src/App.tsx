import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const people = peopleFromServer;
  const [appliedQuery, setAppliedQuery] = useState('');
  const [dropdownActive, setDropdownActive] = useState(false);
  const [hoverActive, setHoverActive] = useState('');
  const [personPicked, setPersonPicked] = useState('');
  const [header, setHeader] = useState('No selected person');

  function debounce(f: (...args: string[]) => void, delay = 500) {
    let timer: number;

    return (...args: string[]) => {
      clearTimeout(timer);
      timer = window.setTimeout(f, delay, ...args);
    };
  }

  /* eslint-disable */

  const applyQuery = useCallback(
    debounce(
      setAppliedQuery,
    ),
    [],
  );

  const getVisiblePeople = () => {
    return people.filter((person) => person
      .name
      .toLowerCase()
      .includes(appliedQuery.toLowerCase()));
  };

  const visiblePeople = useMemo(
    getVisiblePeople,
    [people, appliedQuery],
  );

  const onSelected = (
    personName: string,
    dateBorn: number,
    dateDied: number,
  ) => {
    setPersonPicked(personName);
    setHeader(`${personName} (${dateBorn} - ${dateDied})`);
    setDropdownActive(false);
  };

  const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
  };

  return (
    <main className="section">
    <h1 className="title">{header}</h1>

    <div className={cn('dropdown', { 'is-active': dropdownActive })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={personPicked}
          onFocus={() => setDropdownActive(true)}
          onChange={onChange}
          onBlur={() => setDropdownActive(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {visiblePeople.map((person) => (
            <div
              key={person.name}
              className={cn('dropdown-item', { 'has-background-light': hoverActive === person.name })}
              onMouseEnter={() => setHoverActive(person.name)}
              onMouseDown={() => onSelected(person.name, person.born, person.died)}
              aria-hidden="true"
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
          {!visiblePeople.length && (
            <p className="message has-text-link">No matching suggestions</p>
          )}
        </div>
      </div>
    </div>
  </main>
  )
};
