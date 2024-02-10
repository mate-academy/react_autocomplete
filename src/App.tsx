import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { PeopleList } from './Components/PeopleList/PeopleList';
import { peopleFromServer } from './data/people';
// import { debounce } from 'cypress/types/lodash';

function debounce(
  callback: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) {
  let timerId = 0;

  return (args: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(peopleFromServer[0]);
  const [showList, setShowList] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSelected, setIsSelected] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce(setQuery, 300), [],
  );

  const handleQueryChange = (personName: string) => {
    applyQuery(personName);
    setInputValue(personName);
  };

  const machedPeople = useMemo(() => {
    return peopleFromServer.filter((person) => {
      return person.name.includes(query);
    });
  }, [query]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {isSelected ? (
            `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          ) : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={(event) => {
                handleQueryChange(event.target.value);
                setIsSelected(false);
              }}
              onFocus={() => {
                setShowList(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowList(false);
                }, 100);
              }}
              value={inputValue}
            />
          </div>

          {showList && machedPeople.length > 0 ? (
            <PeopleList
              setSelectedPerson={setSelectedPerson}
              setInputValue={setInputValue}
              setIsSelected={setIsSelected}
            />
          ) : ''}
        </div>

        {machedPeople.length === 0 ? (
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
        ) : ('')}
      </main>
    </div>
  );
};
