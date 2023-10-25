import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import DropdownMenu from './components/DropdownMenu/DropdownMenu';

export const App: React.FC = () => {
  const [data] = useState<Person[]>(peopleFromServer);
  const [curentPerson, setCurrentPerson] = useState<null | Person>(null);
  const [query, setQuery] = useState('');
  const [apliedQuery, setApliedQuery] = useState('');
  const [showPersonList, setShowPersonList] = useState(false);

  // const nameSearch = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (nameSearch.current) {
  //     nameSearch.current.focus();
  //   }
  // }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyDebounce = useCallback(debounce(setApliedQuery, 1000), []);

  const currentTitle = curentPerson
    ? `${curentPerson.name} (${curentPerson.born} - ${curentPerson.died})`
    : 'No selected person';

  const filterPerson: Person[] = useMemo(() => {
    return data.filter((person) => {
      return person.name.includes(apliedQuery);
    });
  }, [apliedQuery, data]);

  const handlerOnMouseDown = (person: Person) => {
    setCurrentPerson(person);
    setQuery(person.name);
  };

  const handlerQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyDebounce(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">{currentTitle}</h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger search-wrapper">
          <input
            value={query}
            onChange={handlerQueryChange}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onBlur={() => setShowPersonList((prev) => !prev)}
            onFocus={() => setShowPersonList((prev) => !prev)}
            // ref={nameSearch}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              type="button"
              className="clearInput"
            >
              <i className="fa fa-close" />
            </button>
          )}
        </div>

        <DropdownMenu
          filterPerson={filterPerson}
          handlerOnMouseDown={handlerOnMouseDown}
          showPersonList={showPersonList}
        />
      </div>
    </main>
  );
};
