import './App.scss';
import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownItem } from './Components/DropdownItem';

function filterPeopleByQuery(peopleToFilter: Person[], query: string) {
  const queryToLowerCase = query.toLowerCase().trim();

  return peopleToFilter
    .filter(({ name }) => name.toLowerCase().includes(queryToLowerCase));
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [hasFocus, setHasFocus] = useState(false);

  const handleFocus = () => {
    setHasFocus(true);
  };

  const filteredPeople: Person[] = useMemo(() => {
    return filterPeopleByQuery(peopleFromServer, appliedQuery);
  }, [appliedQuery]);

  const applyQuery
  = useCallback(debounce(setAppliedQuery, 1000), [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonSelect = (person :Person) => {
    setSelectedPerson(person);
    setQuery(prevQuery => person.name || prevQuery);
    setHasFocus(false);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>

      <div className={classNames('dropdown', { 'is-active': hasFocus })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length
              ? (
                filteredPeople.map((person: Person) => (
                  <DropdownItem
                    person={person}
                    onPersonSelect={handlePersonSelect}
                    key={person.slug}
                  />
                ))
              )
              : (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
};
