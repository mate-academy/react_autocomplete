import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends any[]>(func: (...args: T) => void, delay: number) {
  let timeoutId: NodeJS.Timeout;

  // eslint-disable-next-line func-names
  return function (...args: T) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const Autocomplete: React.FC<{
  debounceDelay: number;
  onSelected: (person: Person | null) => void }>
  = ({ debounceDelay, onSelected }) => {
    const [searchText, setSearchText] = useState<string>('');
    const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const debouncedSearch = debounce((text: string) => {
      // eslint-disable-next-line max-len
      const filtered = peopleFromServer.filter((person) => person.name.toLowerCase().includes(text.toLowerCase()));

      setFilteredPeople(filtered);
    }, debounceDelay);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newText = event.target.value;

      setSearchText(newText);
      debouncedSearch(newText);

      setShowDropdown(newText !== ''
        || document.activeElement === event.target);
    };

    const handleInputFocus = () => {
      setShowDropdown(true);
    };

    const handleDropdownItemClick = (selectedPerson: Person) => {
      setSearchText(selectedPerson.name);
      setShowDropdown(false);
      onSelected(selectedPerson);
    };

    useEffect(() => {
      setShowDropdown(false);
    }, [searchText]);

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={searchText}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>

        {showDropdown && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length === 0 ? (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              ) : (
                filteredPeople.map((person) => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    role="menuitem"
                    tabIndex={0}
                    onClick={() => handleDropdownItemClick(person)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleDropdownItemClick(person);
                      }
                    }}
                  >
                    <p className={`has-text-${person.sex === 'm' ? 'link' : 'danger'}`}>
                      {person.name}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete debounceDelay={500} onSelected={handleSelectedPerson} />
    </main>
  );
};
