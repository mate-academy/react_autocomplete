import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'debounce';
import classNames from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PeopleList } from './PeopleList';
import { getCheckQuery } from './helper/getCheckQuery';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [people] = useState<Person[]>(peopleFromServer);
  const [hasDropdownOpen, setHasDropdownOpen] = useState(false);
  const [apliedQuery, setApliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredPeople = useMemo(() => {
    return people.filter((person) => getCheckQuery(person.name, apliedQuery));
  }, [people, apliedQuery]);

  const appliedQuery = useCallback(debounce(setApliedQuery, 1000), []);

  const handleChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    appliedQuery(e.target.value);
  };

  return (
    <main className="section">
      {selectedPerson ? (
        <h1 className="title">
          {`${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`}
        </h1>
      ) : (
        <h1 className="title">
          No selected person
        </h1>
      )}

      <div className={classNames('dropdown', { 'is-active': hasDropdownOpen })}>
        <div
          className="dropdown-trigger"
        >
          <input
            type="search"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleChangeQuery}
            onFocus={() => setHasDropdownOpen(true)}
            onBlur={() => setHasDropdownOpen(false)}
          />
        </div>

        <PeopleList
          people={filteredPeople}
          onSelected={setSelectedPerson}
          setQuery={setQuery}
        />
      </div>
    </main>
  );
};
