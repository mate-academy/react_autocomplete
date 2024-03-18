import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredPeople, setIsFilteredPeople] = useState<Person[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFilteredPeople = useCallback(
    debounce((inputValue: string) => {
      const filterPeople = peopleFromServer.filter((person: Person) => (
        person.name.toLowerCase().includes(inputValue.toLowerCase())
      ));

      setIsFilteredPeople(filterPeople);
    }, 300), [],
  );

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      setQuery(inputValue);
      setIsVisible(true);
      setSelectedPerson(undefined);

      fetchFilteredPeople(inputValue);
    }, [fetchFilteredPeople],
  );

  const handlePersonSelected = useCallback((person: Person) => {
    setSelectedPerson(person);
    setIsVisible(false);
  }, []);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
            : ('No selected person')}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={selectedPerson?.name || query}
              onChange={handleQueryChange}
              onFocus={() => setIsVisible(true)}
              onBlur={() => setIsVisible(false)}

            />
          </div>
          {isVisible && (
            <Dropdown
              people={filteredPeople}
              onSelected={handlePersonSelected}
            />
          )}

        </div>
        {isVisible && filteredPeople.length === 0 && (
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
