import React, { ChangeEvent, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [people, setPeople] = useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filterPeople = () => {
    setIsFocused(true);
    if (!query) {
      return;
    }

    const filteredPeople = peopleFromServer.filter((person) => {
      const normaliziedQuery = query.toLowerCase().trim();
      const normaliziedName = person.name.toLowerCase().trim();

      return normaliziedName.includes(normaliziedQuery);
    });

    setPeople(filteredPeople);
  };

  const debouncedFilter = useDebouncedCallback(filterPeople, 1000);

  const onSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery('');
    setIsFocused(false);
    setPeople(peopleFromServer);
  };

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsFocused(false);
    debouncedFilter();
  };

  const showSelected = (person: Person | null) => {
    if (person) {
      const { name, born, died } = person;

      return `${name} (${born} - ${died})`;
    }

    return 'No selected person';
  };

  return (
    <main className="section">
      <h1 className="title">
        {showSelected(selectedPerson)}
      </h1>

      {peopleFromServer.length ? (
        <Dropdown
          people={people}
          onSelect={onSelect}
          isFocused={isFocused}
          onSearch={onSearch}
          setIsFocused={setIsFocused}
          query={query}
        />
      ) : (
        <div className="dropdown-content">
          <p className="dropdown-item">
            There are no people to select
          </p>
        </div>
      )}
    </main>
  );
};
