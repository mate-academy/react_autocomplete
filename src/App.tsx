import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const Autocomplete: React.FC<{
  people: Person[];
  debounceDelay?: number;
  onSelected: (person: Person | null) => void;
}> = ({ people, debounceDelay: debounceDelay = 300, onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastSearch, setLastSearch] = useState('');

  const debounce = (func: () => void, delay: number) => {
    let timer: NodeJS.Timeout;

    return () => {
      clearTimeout(timer);
      timer = setTimeout(func, delay);
    };
  };

  const handleChange = (value: string) => {
    setInputValue(value);
    setShowDropdown(true);

    if (value === lastSearch) {
      return;
    }

    debounce(() => {
      const searchValue = value.trim().toLowerCase();

      const filterPeople = people.filter(person =>
        person.name.toLowerCase().includes(searchValue),
      );

      setFilteredPeople(searchValue ? filterPeople : people);
      setLastSearch(value);
    }, debounceDelay)();
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setShowDropdown(false);
    onSelected(person);
  };

  const handleFocus = () => {
    setShowDropdown(true);

    if (!inputValue) {
      setFilteredPeople(people);
    }
  };

  const handleClearSelection = () => {
    setSelectedPerson(null);
    onSelected(null);
  };

  useEffect(() => {
    if (selectedPerson && inputValue !== selectedPerson.name) {
      handleClearSelection();
    }
  }, [inputValue, selectedPerson]);

  return (
    <div className="autocomplete">
      <input
        type="text"
        value={inputValue}
        placeholder="Enter a part of the name"
        className="input"
        onChange={e => handleChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && (
        <div className="dropdown is-active">
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length > 0 ? (
                filteredPeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    onClick={() => handleSelect(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              ) : (
                <div className="dropdown-item" data-cy="no-suggestions-message">
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  const [selectedPersone, setSelectedPersone] = useState<Person | null>(null);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPersone
            ? `${selectedPersone.name} (${selectedPersone.born} - ${selectedPersone.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelected={setSelectedPersone}
          debounceDelay={300}
        />
      </main>
    </div>
  );
};
