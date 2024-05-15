import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [searchedName, setSearchedName] = useState<string>('');

  const { name, born, died } =
    selectedPerson !== null ? selectedPerson : { name: '', born: '', died: '' };

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  const handleSearch = (searchedList: Person[], searchedValue: string) => {
    setFilteredPeople(searchedList);
    setSearchedName(searchedValue);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson !== null
            ? `${name} (${born} - ${died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSearch={handleSearch}
          onSelected={handleSelectedPerson}
          selectedPerson={selectedPerson}
        />

        {searchedName && filteredPeople.length === 0 && (
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
