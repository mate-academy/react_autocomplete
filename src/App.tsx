import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './component/PeopleList';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [active, setActive] = useState<boolean>(false);
  const [applieQuery, setApplieQuery] = useState<string>('');
  const [selected, setSelected] = useState<Person | null>(null);

  const chackSelected = () => {
    if (selected) {
      return `${selected.name} ${selected.born} - ${selected.died}`;
    }

    return 'No selected person';
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setApplieQuery, 300), []);

  // const timerId = useRef(0);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    field.current?.focus();
    setActive(true);
  }, []);

  function handleInputValue(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setQuery(value);
    setSelected(null);
    applyQuery(value);

    // window.clearTimeout(timerId.current);

    // timerId.current = window.setTimeout(() => {
    //   setActive(Boolean(value.trim()));
    //   setApplieQuery(value);
    // }, 1000);
  }

  const filterPeople = useMemo(() => {
    return (
      peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(applieQuery.trim().toLowerCase()),
      ) || null
    );
  }, [applieQuery]);

  // const filterPeople = useCallback(() => {
  //   setPeople(
  //     peopleFromServer.filter(person =>
  //       person.name.toLowerCase().includes(query.toLowerCase()),
  //     ) || null,
  //   );
  // }, [query]);

  // React.useEffect(() => {
  //   filterPeople();
  // }, [query, filterPeople]);

  // const filterPeople = () =>
  //   setPeople(
  //     peopleFromServer.filter(person =>
  //       person.name.toLowerCase().includes(query.toLowerCase()),
  //     ) || null,
  //   );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {/* {selected ? (
          <h1 className="title" data-cy="title">
            {selected.name} {selected.born} - {selected.died}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )} */}

        <h1 className="title" data-cy="title">
          {chackSelected()}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              ref={field}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={e => handleInputValue(e)}
              // onFocus={() => setActive(true)}
              // onClick={() => setActive(carrent => !carrent)}
              // onBlur={() => setActive(false)}
            />
          </div>

          {Boolean(filterPeople.length) && active && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                <PeopleList people={filterPeople} onSelected={setSelected} />
              </div>
            </div>
          )}
        </div>

        {!filterPeople?.length && (
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
        )}
      </main>
    </div>
  );
};
