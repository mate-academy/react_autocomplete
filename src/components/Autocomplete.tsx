import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import PersonList from './PersonList';

type Props = {
  peopleFromServer: Person[],
  debounceDelay: number,
};

const Autocomplete:React.FC<Props> = ({ peopleFromServer, debounceDelay }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | undefined>();
  const [inputValue, setInputValue] = useState('');
  const [isVisibleList, setIsVisibleList] = useState(false);
  const [delaySearch, setDelaySearch] = useState('');

  const searchDebounceFunction = (e:string) => {
    setDelaySearch(e);
    setIsVisibleList(true);
  };

  const pingedSearch = useCallback((e) => debounce(
    () => searchDebounceFunction(e), debounceDelay,
  )(), [debounceDelay]);

  const searchInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsVisibleList(false);
    setInputValue(e.target.value);
    pingedSearch(e.target.value);
  };

  const filteredPeople = peopleFromServer.filter(person => {
    const smallName = person.name.toLocaleLowerCase();
    const smallRequest = delaySearch.toLocaleLowerCase();

    return smallName.includes(smallRequest);
  });

  const handleFocus = () => {
    setIsVisibleList(true);
  };

  const handleBlur = () => {
    setIsVisibleList(false);
  };

  return (
    <>
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
    </>
  );
};

export default Autocomplete;
