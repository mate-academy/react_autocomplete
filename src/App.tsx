import React, { useMemo, useState, useCallback } from 'react';
import './App.scss';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { peopleFromServer } from './data/people';
import { List } from './components/List';
import { Person } from './types/Person';

const findPersonBySlug = (slug: string): Person | null => {
  return peopleFromServer.find(person => person.slug === slug) || null;
};

const getPeopleByQuery = (people: Person[], query: string): Person[] => {
  const normQuery = query.trim().toLowerCase();

  return people.filter(person => person.name.toLowerCase().includes(normQuery));
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [person, setPerson] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [showNoSuggestions, setShowNoSuggestions] = useState(false);

  const selectedPerson = useMemo(() => findPersonBySlug(person)
    || null, [person]);

  const debouncedFilterPeople = useCallback(
    debounce((input: string) => {
      const filtered = getPeopleByQuery(peopleFromServer, input);

      setFilteredPeople(filtered);
      setShowNoSuggestions(filtered.length === 0);
    }, 300),
    [],
  );

  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);

    if (selectedPerson && selectedPerson.name
      .toLowerCase() !== value.toLowerCase()) {
      setPerson('');
    }

    debouncedFilterPeople(value);
  }, [selectedPerson, debouncedFilterPeople]);

  const handleSelectedPeople = (
    event: React.MouseEvent,
    personSlug: string,
  ): void => {
    event.preventDefault();
    setPerson(personSlug);
    const selected = findPersonBySlug(personSlug) || null;

    if (selected) {
      setQuery(selected.name);
    }
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={classNames('dropdown', {
        'is-active': query && !person,
      })}
      >
        <div className="dropdown-trigger">
          <input
            value={query}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </div>

        {query && !showNoSuggestions && (
          <List
            people={filteredPeople}
            onSelected={handleSelectedPeople}
          />
        )}
      </div>
    </main>
  );
};
