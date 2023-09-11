import debounce from 'lodash.debounce';
import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDownContent } from './components/DropDownContent';
import { Person } from './types/Person';

function showSelectedPersonInfo(selectedPerson: Person | null) {
  if (selectedPerson) {
    const { name, born, died } = selectedPerson;

    return `${name} (${born} - ${died})`;
  }

  return 'No selected person';
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [people, setPeople] = useState<Person[]>(peopleFromServer);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSelectPerson = (newPerson: Person) => {
    setSelectedPerson(newPerson);
    setInputValue('');
    setIsFocused(false);
    setPeople(peopleFromServer);
  };

  const filterPeople = () => {
    setIsFocused(true);
    if (!inputValue) {
      return;
    }

    const filteredPeople = peopleFromServer.filter((person) => {
      const normaliziedInput = inputValue.toLowerCase().trim();
      const normaliziedName = person.name?.toLowerCase().trim();

      return normaliziedName?.includes(normaliziedInput);
    });

    setPeople(filteredPeople);
  };

  const applyInput = useCallback(
    debounce(filterPeople, 500),
    [],
  );

  const handleInputValueChange
    = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      setIsFocused(false);
      applyInput();
    };

  return (
    <main className="section">
      <h1 className="title">
        {showSelectedPersonInfo(selectedPerson)}
      </h1>

      {peopleFromServer.length ? (
        <DropDownContent
          people={people}
          onSelected={handleSelectPerson}
          isFocused={isFocused}
          onSearch={handleInputValueChange}
          setIsFocused={setIsFocused}
          query={inputValue}
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
