import './App.scss';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { useState, useCallback, useMemo } from 'react';
import { PeopleList } from './components/peopleList';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const DELAY = 1000;

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isListVisible, setIsListVisible] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const aplyQuery = useCallback(debounce(setAppliedQuery, DELAY), []);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    aplyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => (
    peopleFromServer
      .filter((person) => (
        person.name.toLowerCase().includes(appliedQuery.toLowerCase())
      ))
  ), [peopleFromServer, appliedQuery]);

  const selectHandler = (person: Person) => {
    setSelectedPerson(person);
    setAppliedQuery('');
    setInputValue(person.name);
    setIsListVisible(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={classNames('dropdown', { 'is-active': isListVisible })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            value={inputValue}
            placeholder="Enter a part of the name"
            className="input"
            onFocus={() => setIsListVisible(true)}
            onChange={onChangeHandler}
          />
        </div>
        <PeopleList people={filteredPeople} onSelect={selectHandler} />
      </div>
    </main>
  );
};
