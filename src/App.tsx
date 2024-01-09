import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';

function debounce<T>(
  callback: (...args: T[]) => void,
  delay: number,
): (...args: T[]) => void {
  let timerId = 0;

  return (...args: T[]) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const applyQuery = useMemo(() => debounce(setAppliedQuery, 1000), []);

  const initialPerson: Person[] = peopleFromServer.map((person, index) => ({
    ...person,
    id: index + 1,
  }));

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsVisible(false);
  };

  const handleSelectSuggestion = (selectedName: string) => {
    const selected = peopleFromServer.find(
      (person) => person.name.toLowerCase() === selectedName.toLowerCase(),
    );

    setSelectedPerson(selected || null);
    setQuery(selectedName);
    setAppliedQuery(selectedName);
    setTimeout(() => {
      setIsVisible(true);
    }, 1000);
  };

  const filteredPeople = useMemo(() => {
    if (!query) {
      return initialPerson;
    }

    return initialPerson.filter(
      (person) => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()),
    );
  }, [query, appliedQuery, initialPerson]);

  const titleText = (selectedPerson === null && !appliedQuery)
    || filteredPeople.length === 0
    ? 'No selected person'
    : `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`;

  return (
    <main className="section">
      <h1 className="title">
        {titleText}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleQueryChange}
            value={query}
          />
          {filteredPeople.length === 0 && query
          && <p>No matching suggestions</p>}

        </div>

        <div className="dropdown-menu" role="menu">
          {filteredPeople.length === 0 && query ? null : (
            <div className={`dropdown-content ${isVisible ? 'visible' : ''}`}>
              <PeopleList
                people={filteredPeople}
                onSelect={handleSelectSuggestion}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
