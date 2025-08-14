import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debounce, setDebounce] = useState<boolean>(false);
  const [selected, setSelected] = useState<Person | null>(null);

  const peoplesInitial: Person[] = useMemo(() => {
    return peopleFromServer.filter((people: Person) => {
      const searchTermLower = searchTerm.toLowerCase();
      const namePeopleLower = people.name.toLowerCase();

      return namePeopleLower.includes(searchTermLower.trim());
    });
  }, [searchTerm]);

  const [peoples, setPeoples] = useState<Person[]>(peoplesInitial);

  const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setDebounce(false);
    setSearchTerm(value);
    setSelected(null);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();

    setSearchTerm(' ');
  };

  useEffect(() => {
    setPeoples(peoplesInitial);
  }, [searchTerm]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {useMemo(() => {
            return selected
              ? `${selected.name} (${selected.born} - ${selected.died})`
              : 'No selected person';
          }, [selected])}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={searchTerm}
              onChange={handleSearchTerm}
              onFocus={handleFocus}
            />
          </div>

          {searchTerm !== '' && (
            <Autocomplete
              peoples={peoples}
              debounce={debounce}
              setDebounce={setDebounce}
              delay={300}
              setSelected={setSelected}
            />
          )}
        </div>

        {peoples.length === 0 && (
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
