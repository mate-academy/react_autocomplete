import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState <Person | null>(null);
  const [query, setQuery] = useState('');
  const [applyedQuery, setApplyedQuery] = useState('');
  const [isListOpened, setIsListOpened] = useState(false);

  const applyQuery = useCallback(debounce(setApplyedQuery, 500), []);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(query.toLowerCase())
    ));
  }, [applyedQuery, peopleFromServer]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsListOpened(false);
    }, 100);
  }, []);

  const handleQueryChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  }, []);

  const handleOnSelect = useCallback((
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setSelectedPerson(person);
    setQuery(person.name);
    setIsListOpened(false);
    setApplyedQuery(person.name);
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsListOpened(true)}
              onBlur={handleBlur}
            />
          </div>

          {isListOpened
          && (
            <Dropdown
              people={filteredPeople}
              onSelect={handleOnSelect}
            />
          )}
        </div>
      </div>
    </main>
  );
};
