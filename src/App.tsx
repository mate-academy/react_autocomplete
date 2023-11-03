import debounce from 'lodash.debounce';
import { useMemo, useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { List } from './components/List/List';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setApplyQuerry] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // const handleFocus = () => {
  //   setIsFocused(true);
  // };

  // const handleBlur = () => {
  //   setIsFocused(true);
  // };

  const reset = () => {
    setSelectedPerson('');
  };

  const handleValue = () => {
    let value = query;

    if (selectedPerson) {
      value = selectedPerson;
    }

    return value;
  };

  const onSelected = (newPerson: string) => {
    if (newPerson !== selectedPerson) {
      setSelectedPerson(newPerson);
    }
  };

  const findPerson = peopleFromServer.find(
    person => person.name === selectedPerson,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuerry = useCallback(
    debounce(setApplyQuerry, 1000),
    [],
  );

  const handlerQuery = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuerry(event.target.value);
    reset();
  };

  const filteredPeople: Person[] = useMemo(() => {
    return [...peopleFromServer].filter(
      person => person.name.includes(appliedQuery.trim()),
    );
  },
  [appliedQuery]);

  return (
    <main
      className="section"
    >
      <h1 className="title">
        { findPerson && `${findPerson.name} (${findPerson.born} = ${findPerson.died})`}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={handleValue()}
            onChange={handlerQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(true)}
          />
        </div>
        <div className="dropdown-menu" role="menu">
          <div
            className="dropdown-content"
          >
            {(isFocused && !query)
            && (!selectedPerson) && peopleFromServer.map(person => (
              <List
                person={person}
                onSelected={onSelected}
                key={person.name}
              />
            ))}
            {(query && !selectedPerson) && filteredPeople.map((person) => (
              <List
                person={person}
                onSelected={onSelected}
                key={person.name}
              />
            ))}
            {(!selectedPerson && !filteredPeople.find(
              p => p.name.includes(query),
            ) && query)
              && 'No matching suggestions'}
          </div>
        </div>
      </div>
    </main>
  );
};
