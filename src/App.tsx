/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './App.scss';

import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { DropdownList } from './components/dropdownList';

export const App: React.FC = React.memo(() => {
  const [isActive, setIsActive] = useState(false);
  const [title, setTitle] = useState('No selected person');
  const [people, setPeople] = useState(peopleFromServer);
  const [inputData, setInputData] = useState('');

  const filteredPeople = (string: string) => {
    setPeople(
      peopleFromServer.filter((human) => human.name
        .toLowerCase()
        .includes(string.toLowerCase())),
    );
  };

  useEffect(() => {
    let timerId = 0;

    return () => {
      clearTimeout(timerId);

      timerId = window.setTimeout(() => filteredPeople(inputData), 1000);
    };
  }, [inputData]);

  return (
    <main className="section">
      <h1 className="title">{title}</h1>

      <div className={cn('dropdown', { 'is-active': isActive })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputData}
            onFocus={() => setIsActive(true)}
            onChange={(e) => setInputData(e.target.value)}
          />
        </div>

        <DropdownList
          people={people}
          set={{
            title: setTitle,
            showList: setIsActive,
            inputClear: setInputData,
          }}
        />
      </div>
    </main>
  );
});
