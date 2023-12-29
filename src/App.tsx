import React, {
  useCallback, useMemo, useEffect, useState,
} from 'react';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';

import { Person } from './types/Person';
import { PeopleList } from './components/PeopleList/PeopleList';

const APPLY_QUERY_DELAY = 1000;

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const onApplyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value),
      APPLY_QUERY_DELAY),
    [],
  );

  const filteredPeople = useMemo(() => {
    setIsDropdownVisible(true);

    return peopleFromServer.filter((person) => person.name.toLowerCase()
      .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      onApplyQuery(event.target.value);
    },
    [],
  );

  const handlePersonSelection = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      person: Person,
    ) => {
      event.preventDefault();
      setSelectedPerson(person);
      setQuery(person.name);
      setAppliedQuery(person.name);
      setIsDropdownVisible(false);
    },
    [],
  );

  useEffect(() => {
    setIsDropdownVisible(false);
  }, [query]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'Nobody was selected'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsDropdownVisible(true)}
          />
        </div>

        {isDropdownVisible && (
          <PeopleList
            people={filteredPeople}
            onSelect={handlePersonSelection}
          />
        )}
      </div>
    </main>
  );
};
