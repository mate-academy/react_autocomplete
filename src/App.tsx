import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList';

const DELAY = 500;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [applyedQuery, setApplyedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isListVisible, setIsListVisible] = useState(false);

  const applyQuery = useCallback(debounce(setApplyedQuery, DELAY), []);

  const filteredPeople = useMemo(() => {
    setIsListVisible(true);

    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(applyedQuery.toLowerCase())
    ));
  }, [applyedQuery, peopleFromServer]);

  const handleQueryChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  }, []);

  const handleSelectPerson = useCallback((
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setSelectedPerson(person);
    setQuery(person.name);
    setApplyedQuery(person.name);
    setIsListVisible(false);
  }, []);

  useEffect(() => {
    setIsListVisible(false);
  }, [query]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsListVisible(true)}
          />
        </div>

        {isListVisible && (
          <PeopleList people={filteredPeople} onSelect={handleSelectPerson} />
        )}
      </div>
    </main>
  );
};
