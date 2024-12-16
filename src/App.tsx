import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown';

type Props = {
  debounce?: number;
  onSelected?: (person: Person) => void;
};

export const App: React.FC<Props> = ({ debounce = 300, onSelected }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState<string>('');
  const [filteredPeople, setFilteredPeople] =
    useState<Person[]>(peopleFromServer);

  const { name, born, died } = selectedPerson || {};

  const handleSelected = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
      if (onSelected) {
        onSelected(person);
      }
    },
    [onSelected],
  );

  const handleQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredPeople(
        peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }, debounce);

    return () => clearTimeout(timer);
  }, [query, debounce]);

  useEffect(() => {
    if (!!query && selectedPerson) {
      setSelectedPerson(null);
    }
  }, [query]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${name} (${born} - ${died})`
            : `No selected person`}
        </h1>

        <Dropdown
          query={query}
          filteredPeople={filteredPeople}
          onQueryChange={handleQuery}
          onPersonSelect={handleSelected}
        />

        {filteredPeople.length === 0 && (
          <div
            className="
            notification
            is-danger is-light mt-3 is-align-self-flex-start"
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
