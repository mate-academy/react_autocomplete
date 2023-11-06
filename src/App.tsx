import React, { useState, useEffect, useMemo } from 'react';
import './App.scss';
import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

// #start region Autocomplete
const Autocomplete: React.FC<{
  delay: number;
  people: Person[];
  onSelected: (person: Person | null) => void;
}> = ({ delay, people, onSelected }) => {
  const [text, setText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Person[]>(people);

  const filterPeopleWithDelay = useMemo(() => {
    return debounce((input: string) => {
      const filteredPeople = people.filter((person) => (
        person.name.toLowerCase().includes(input.toLowerCase())
      ));

      setSuggestions(filteredPeople);
    }, delay);
  }, [people, delay]);

  useEffect(() => {
    filterPeopleWithDelay(text);
  }, [text, filterPeopleWithDelay]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    setText(input);

    // Відображаємо попередній список з затримкою
    filterPeopleWithDelay(input);
  };

  const handleInputFocus = () => {
    if (text === '') {
      setSuggestions(people);
    }
  };

  const handleSuggestionClick = (person: Person) => {
    setText(person.name);
    setSuggestions([]);
    onSelected(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          value={text}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {suggestions.length === 0 ? (
            <div className="dropdown-item">No matching suggestions</div>
          ) : (
            suggestions.map((person) => (
              <button
                type="button"
                className="dropdown-item"
                key={person.slug}
                onClick={() => handleSuggestionClick(person)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSuggestionClick(person);
                  }
                }}
              >
                <p>
                  {person.name}

                </p>
              </button>
            )))}
        </div>
      </div>
    </div>
  );
};
// #end region Autocomplete

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>
      <Autocomplete
        delay={1000}
        people={peopleFromServer}
        onSelected={(person) => setSelectedPerson(person)}
      />
    </main>
  );
};
