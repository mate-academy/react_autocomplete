import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PersonList } from './components/PersonList';
import { debounce } from './utils/debounce';
// import { preparePersonList } from './utils/preparePersonList';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { name, born, died } = selectedPerson || {};
  const [onFocus, setOnFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  let preparedPeopleList: Person[] = [...peopleFromServer];

  function preparePersonList(): void {
    preparedPeopleList = preparedPeopleList.filter(
      person => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase().trim()),
    );
  }

  function handleBlur() {
    setTimeout(() => {
      setQuery('');
      setOnFocus(false);
    }, 100);
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
            onFocus={() => setOnFocus(true)}
            onBlur={handleBlur}
            onChange={event => {
              setQuery(event.target.value);
              handleInput(event.target.value);
            }}
          />
        </div>

        {onFocus && (
          <PersonList
            preparedPeopleList={preparedPeopleList}
            // eslint-disable-next-line react/jsx-no-bind
            handleSelectPerson={handleSelectPerson}
          />
        )}
      </div>
    </main>
  );
};
