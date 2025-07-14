import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownList } from './components/DropdownList';
import { Person } from './types/Person';
import debounce from 'lodash/debounce';

type Props = { delay?: number };

export const App: React.FC<Props> = ({ delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [people] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debounceQuery = useCallback(debounce(setDebouncedQuery, delay), [
    delay,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setQuery(value);

    if (value.trim() === '') {
      setDebouncedQuery('');
      setSelectedPerson(null);

      return;
    }

    debounceQuery(value);
    setSelectedPerson(null);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [debouncedQuery, people]);

  const handleSelectPerson = useCallback(
    (slug: string) => {
      setSelectedPerson(people.find(person => person.slug === slug) || null);
      setIsDropdownOpen(false);
      setQuery('');
      setDebouncedQuery('');
    },
    [people],
  );

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
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsDropdownOpen(true)}
            />
          </div>

          {isDropdownOpen && (
            <DropdownList
              people={filteredPeople}
              onSelected={handleSelectPerson}
            />
          )}
        </div>

        {filteredPeople.length === 0 ? (
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
        ) : (
          ''
        )}
      </main>
    </div>
  );
};
