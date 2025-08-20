import React, { useState } from 'react';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/Dropdown/Dropdown';
import { Autocomplete } from './components/Autocomplete/Autocomplete';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [focused, setFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleChange = (
    newQuery: string,
    filtered: Person[],
    isFocused: boolean,
  ) => {
    setQuery(newQuery);
    setFilteredPeople(filtered);
    setFocused(isFocused);

    if (selectedPerson && newQuery !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  };

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  const noMatching =
    query.trim() !== '' && filteredPeople.length === 0 && focused;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {(selectedPerson &&
            `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`) ||
            'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <Autocomplete
            items={peopleFromServer}
            delay={300}
            onChange={handleChange}
            query={query}
          />

          {focused && filteredPeople.length > 0 && (
            <Dropdown people={filteredPeople} onSelected={handlePersonSelect} />
          )}
        </div>

        {noMatching && (
          <div
            // eslint-disable-next-line max-len
            className="notification is-danger is-light mt-3 is-align-self-flex-start"
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
