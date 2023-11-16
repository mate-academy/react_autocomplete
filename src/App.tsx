import React, { useCallback, useState } from 'react';
import './App.scss';
import { PostList } from './components/PostList';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

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
  selectedPerson: Person | null;
  targetValue: string;
  isListVisible: boolean;
  appliedQuery: string;
}

function getPreparedPeople(
  people: Person[],
  {
    selectedPerson, targetValue, isListVisible, appliedQuery,
  }: FilterParams,
) {
  let preparedPosts = [...people];

  if (!isListVisible) {
    return [];
  }

  if (targetValue) {
    const filt = (item: string) => item.toLowerCase().includes(appliedQuery);

    preparedPosts = preparedPosts.filter(person => filt(person.name));
  }

  if (selectedPerson) {
    const x = (item: string | string[]) => item.includes(selectedPerson.name);
    const y = (item: string) => x(item.toLowerCase());
    const filt2 = (item: string) => y(item);

    preparedPosts = preparedPosts.filter(person => filt2(person.name));
  }

  return preparedPosts;
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [targetValue, setTargetValue] = useState('');
  const [titleWithPerson, setTitleWithPerson] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const onSelected = (person: Person) => {
    const curPerson = peopleFromServer.find(body => body.name === person.name)
    || null;

    setTargetValue(curPerson?.name || '');
    setSelectedPerson(curPerson);

    curPerson
      ? setTitleWithPerson(`${curPerson.name} ${curPerson.born} - ${curPerson.died}`)
      : setTitleWithPerson('No matching suggestions');
  };

  const handler = (value: string) => {
    setTargetValue(value);
    applyQuery(value);
  };

  const visiblePeople = getPreparedPeople(peopleFromServer, {
    selectedPerson,
    targetValue,
    isListVisible,
    appliedQuery,
  });

  return (
    <main className="section">
      <h1 className="title">
        {titleWithPerson}
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
            onClick={() => setIsListVisible(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <PostList people={visiblePeople} selectedBody={onSelected} />
        </div>
      </div>
    </main>
  );
};
