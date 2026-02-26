import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { SuggestionList } from './components/SuggestionList';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

export const App: React.FC = () => {
  //const [filteredPeople, setFilteredPeople] = useState([]);
  const [query, setQuery] = useState('');
  const [preparedQuery, setPreparedQuery] = useState('');
  const [blured, setBlured] = useState(false);
  const [selected, setSelected] = useState<Person | null>(null);
  const { name, born, died } = selected ?? peopleFromServer[0];

  const createdFilteredPeople = useMemo(
    () =>
      peopleFromServer.filter(person =>
        person.name.includes(preparedQuery.trim()),
      ),
    [preparedQuery],
  );

  const applyQuery = useCallback(debounce(setPreparedQuery, 300), []);
  const loseQuery = useCallback(debounce(setBlured, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setSelected(null);
  };

  const handleSelect = (personSelected: Person) => {
    setSelected(personSelected);
    setBlured(false);
    setQuery(personSelected.name);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected ? `${name} (${born} - ${died})` : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setBlured(true)}
              onBlur={() => loseQuery(false)}
            />
          </div>

          {blured && (
            <SuggestionList
              filteredPeople={createdFilteredPeople}
              onSelected={handleSelect}
            />
          )}
        </div>

        {createdFilteredPeople.length === 0 && preparedQuery && blured && (
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
