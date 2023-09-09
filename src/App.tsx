import React, {
  ChangeEvent,
  useState,
} from 'react';

import './App.scss';
import { useDebounce } from './useDebounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDown } from './components/DropDown';
import { showSelectedPersonInfo } from './helpers/showSelectedPersonInfo';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [people, setPeople] = useState<Person[]>(peopleFromServer);

  const [query, setQuery] = useState('');

  const [isFocused, setIsFocused] = useState(false);

  const handleSelectPerson = (newPerson: Person) => {
    setSelectedPerson(newPerson);
    setQuery('');
    setIsFocused(false);
    setPeople(peopleFromServer);
  };

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

  const debouncedFilter = useDebounce(filterPeople, 1000);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsFocused(false);
    debouncedFilter();
  };

  return (
    <main className="section">
      <h1 className="title">
        {showSelectedPersonInfo(selectedPerson)}
      </h1>
      {peopleFromServer.length ? (
        <DropDown
          people={people}
          onSelected={handleSelectPerson}
          isFocused={isFocused}
          onSearch={handleSearch}
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
