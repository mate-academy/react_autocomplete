import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';

import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { DropdownList } from './components/dropdownList';

export const App: React.FC = React.memo(() => {
  let timerId = 0;
  const delay = 1000;
  const [isActive, setIsActive] = useState(false);
  const [title, setTitle] = useState('No selected person');
  const [inputData, setInputData] = useState('');
  const people = useMemo(() => peopleFromServer.filter(({ name }) => name
    .toLowerCase().includes(inputData.toLowerCase())),
  [inputData]);

  const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      setInputData(e.target.value);
    }, delay);
  };

  useEffect(() => {
    setIsActive(false);
    setInputData('');
  }, [title]);

  return (
    <main className="section">
      <h1 className="title">{title}</h1>

      <div className={cn('dropdown', { 'is-active': isActive })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            defaultValue={inputData}
            onFocus={() => setIsActive(true)}
            onChange={handler}
          />
        </div>

        <DropdownList
          people={people}
          title={setTitle}
        />
      </div>
    </main>
  );
});
