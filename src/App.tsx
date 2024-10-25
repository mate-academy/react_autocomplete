import debounce from 'lodash.debounce';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDown } from './components/DropDown';

export const App: React.FC = () => {
  const [people] = useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const inputValue = useRef<HTMLInputElement | null>(null);
  const applyQuery = useCallback(debounce(setAppliedQuery, 500), []);
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelectedPerson(null);
  };

  useEffect(() => {
    if (inputValue.current) {
      inputValue.current.focus();
    }
  }, []);

  const filteredPeople = useMemo(() => {
    if (appliedQuery === '') {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [people, appliedQuery]);

  const handleChooseUser = useCallback((person: Person) => {
    setSelectedPerson(person);
  }, []);

  const visiblePeople = filteredPeople;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query}
              ref={inputValue}
              onChange={handleQueryChange}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          <DropDown
            visiblePeople={visiblePeople}
            onSelected={handleChooseUser}
          />
        </div>

        {!visiblePeople.length && (
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
