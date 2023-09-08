import React, { useCallback, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropdownMenu } from './DropdownMenu';
import { DropdownInput } from './DropdownInput';

const search = (people: Person[], query: string) => {
  const preparedQuery = query.trim().toLowerCase();

  return people
    .filter(person => person.name.toLowerCase().includes(preparedQuery));
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isListShown, setIsListShown] = useState(false);

  const applyDebounceQuery = useCallback(
    debounce(setDebouncedQuery, 800),
    [],
  );

  const filteredPeople = useMemo(() => {
    return search(peopleFromServer, query);
  }, [debouncedQuery]);

  const onSelect = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
      setIsListShown(false);
    },
    [debouncedQuery],
  );

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    applyDebounceQuery(newQuery);
  }, [debouncedQuery]);

  const handleResetQuery = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  const handlePersonClick = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setDebouncedQuery('');
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (
            <div>
              {`${selectedPerson.name}`
                + ` (${selectedPerson.born} - ${selectedPerson.died})`}

              <span>
                <button
                  type="button"
                  className="delete"
                  aria-label="close"
                  onClick={() => setSelectedPerson(null)}
                />
              </span>
            </div>
          )
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <DropdownInput
          query={query}
          handleQueryChange={handleQueryChange}
          setIsListShown={setIsListShown}
          handleResetQuery={handleResetQuery}
        />

        {isListShown && (
          <DropdownMenu
            filteredPeople={filteredPeople}
            selectedPerson={selectedPerson}
            handlePersonClick={handlePersonClick}
            onSelect={onSelect}
          />
        )}
      </div>
    </main>
  );
};
