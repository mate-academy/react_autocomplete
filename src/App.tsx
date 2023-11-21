import React, { useCallback, useState } from 'react';
import './App.scss';
import { PostList } from './components/PostList';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
/* eslint-disable  @typescript-eslint/no-explicit-any */

function debounce(callback: any, delay: number) {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

interface FilterParams {
  appliedQuery: string;
}

function getPreparedPeople(
  people: Person[],
  {
    appliedQuery,
  }: FilterParams,
) {
  let preparedPosts = [...people];

  const filt = (item: string) => item.toLowerCase().includes(appliedQuery);

  preparedPosts = preparedPosts.filter(person => filt(person.name));

  return preparedPosts;
}

export const App: React.FC = () => {
  const [targetValue, setTargetValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const title = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
    : 'no selected person';

  const onSelected = (person: Person) => {
    const curPerson = peopleFromServer.find(body => body.name === person.name)
    || null;

    setTargetValue(curPerson?.name || '');
    setSelectedPerson(curPerson);
    setIsListVisible(false);
  };

  const handler = (value: string) => {
    setTargetValue(value);
    applyQuery(value.toLowerCase());
  };

  const visiblePeople = appliedQuery
    ? getPreparedPeople(peopleFromServer, { appliedQuery })
    : peopleFromServer;

  return (
    <main className="section">
      <h1 className="title">
        {title}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            required
            placeholder="Enter a part of the name"
            className="input"
            value={targetValue}
            onChange={event => handler(event.target.value)}
            onFocus={() => setIsListVisible(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          {isListVisible
            && <PostList people={visiblePeople} selectedBody={onSelected} />}
        </div>
      </div>
    </main>
  );
};
