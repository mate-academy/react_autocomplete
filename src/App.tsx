import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

interface Props {
  debounceDelay?: number;
}

export const App: React.FC<Props> = ({ debounceDelay = 300 }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyFilter = useMemo(
    () =>
      debounce((currentQuery: string) => {
        setQuery(currentQuery);
      }, debounceDelay),
    [debounceDelay],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson(null);
    applyFilter(event.target.value);
  };

  const handleOnSelect = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      person: Person,
    ) => {
      event.preventDefault();
      setSelectedPerson(person);
      setQuery(person.name);
      setFocused(false);
    },
    [],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedPerson ? (
          <h1 className="title" data-cy="title">
            {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={handleQueryChange}
              onFocus={() => setFocused(true)}
            />
          </div>

          {focused && (
            <Dropdown people={filteredPeople} onSelect={handleOnSelect} />
          )}
        </div>
      </main>
    </div>
  );
};
