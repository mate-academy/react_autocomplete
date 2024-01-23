import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PersonList } from './components/PersonList';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};
  const [onFocus, setOnFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [hasListVisible, setHasListVisible] = useState(false);

  let preparedPeopleList: Person[] = [...peopleFromServer];

  // eslint-disable-next-line @typescript-eslint/ban-types
  function debounce(callback: Function, delay: number) {
    let timerId = 0;

    return (args: string) => {
      window.clearTimeout(timerId);

      timerId = window.setTimeout(() => {
        callback(args);
      }, delay);
    };
  }

  function preparePersonList(): void {
    preparedPeopleList = preparedPeopleList.filter(
      person => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase().trim()),
    );
  }

  function handleBlur(event: HTMLFormElement) {
    event.stopPropagination();
    setQuery('');
    setOnFocus(!onFocus);
  }

  // eslint-disable-next-line
  const handleInput = useCallback(
    debounce((value: string) => {
      setAppliedQuery(value);
    }, 1500),
    [],
  );

  function handleSelectPerson(person: Person): void {
    setSelectedPerson(person);
    setHasListVisible(false);
    setOnFocus(false);
    setQuery(person.name);
  }

  if (query !== '' && query !== selectedPerson?.name) {
    preparePersonList();
  }

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${name} (${born} = ${died})`
        ) : (
          'No Selected Person'
        )}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onFocus={() => setOnFocus(!onFocus)}
            onBlur={() => handleBlur}
            onChange={event => {
              setQuery(event.target.value);
              handleInput(event.target.value);
            }}
          />
        </div>

        {(hasListVisible || onFocus) && (
          <PersonList
            preparedPeopleList={preparedPeopleList}
            // eslint-disable-next-line react/jsx-no-bind
            handleSelectPerson={handleSelectPerson}
          // setAppliedQuery={setAppliedQuery}
          />
        )}
      </div>
    </main>
  );
};
