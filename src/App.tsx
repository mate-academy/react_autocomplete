/* eslint-disable @typescript-eslint/indent */
/* eslint-disable prettier/prettier */
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';

interface Props {
  delay?: number;
}

export const App: FC<Props> = ({ delay = 300 }) => {
  const [filteredPersons, setFilteredPersons] = useState<Person[] | undefined>(
    peopleFromServer,
  );
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [focusInput, setFocusInput] = useState<boolean>(false);
  const [selectedPerson, setSelectedPerson] = useState<
    Person | 'No selected person'
  >('No selected person');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearchChange = useCallback(debounce(setSearch, delay), []);

  const filterForPeople = useMemo(
    () =>
      peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(search),
      ),
    [search],
  );

  const selectPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    setFocusInput(false);
    setQuery(person.name);
  }, []);

  const handleChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      onSearchChange(e.target.value.toLowerCase());
      setSelectedPerson('No selected person');
    },
    [onSearchChange],
  );

  const title =
    selectedPerson !== 'No selected person'
      ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
      : 'No selected person';

  useEffect(() => {
    setFilteredPersons(filterForPeople);
  }, [filterForPeople, search]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div
          className={classNames('dropdown', {
            'is-active': focusInput,
          })}
          onFocus={() => setFocusInput(true)}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleChangeSearch}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <ul className="dropdown-content">
              {filteredPersons &&
                filteredPersons.map(person => (
                  <li
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.name}
                    onClick={() => selectPerson(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {!filteredPersons?.length && (
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
