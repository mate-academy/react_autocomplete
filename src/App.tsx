import React, {
  ChangeEvent,
  useState,
} from 'react';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDown } from './components/DropDown';
import { useDebounce } from './useDebounce';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [people, setPeople] = useState<Person[]>(peopleFromServer);
  const [isFocused, setIsFocused] = useState(false);

  function showSelectedPersonInfo() {
    if (selectedPerson) {
      const { name, born, died } = selectedPerson;

      return `${name} (${born} - ${died})`;
    }

    return 'No selected person';
  }

  const selectPersonHandler = (newPerson: Person) => {
    setSelectedPerson(() => newPerson);
    setQuery('');
    setIsFocused(false);
    setPeople(peopleFromServer);
  };

  const filterPeople = () => {
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

    debouncedFilter();
  };

  return (
    <main className="section">
      <h1 className="title">
        {showSelectedPersonInfo()}
      </h1>
      <DropDown
        people={people}
        onSelected={selectPersonHandler}
        isFocused={isFocused}
        onSearch={handleSearch}
        setIsFocused={setIsFocused}
        query={query}
      />
    </main>
  );
};
