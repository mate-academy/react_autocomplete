import React, { useCallback, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import PersonList from './PersonList';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | undefined>();
  const [inputValue, setInputValue] = useState('');

  const [isVisibleList, setIsVisibleList] = useState(false);
  const [pingSearch, setPingSearch] = useState('');

  const searchDebounceFunction = (e:string) => {
    setPingSearch(e);
    setIsVisibleList(true);
  };

  const pingedSearch = useCallback(
    debounce(searchDebounceFunction, 1000),
    [],
  );

  const searchInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsVisibleList(false);
    setInputValue(e.target.value);
    pingedSearch(e.target.value);
  };

  const filteredPeople = peopleFromServer.filter(person => {
    const smallName = person.name.toLocaleLowerCase();
    const smallRequest = pingSearch.toLocaleLowerCase();

    return smallName.includes(smallRequest);
  });

  const handleFocus = () => {
    setIsVisibleList(true);
  };

  const handleBlur = () => {
    setIsVisibleList(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})` : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputValue}
            onChange={searchInputHandler}
            onBlur={handleBlur}
            onFocus={handleFocus}
          />
        </div>
        {isVisibleList && (
          <PersonList
            filteredPeople={filteredPeople}
            setSelectedPerson={setSelectedPerson}
            setIsVisibleList={setIsVisibleList}
            setInputValue={setInputValue}
          />
        )}
      </div>
    </main>
  );
};
