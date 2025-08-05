import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  onSelected?: (person: Person) => void;
}

export const App: React.FC<AppProps> = ({ onSelected }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchFocus = () => {
    setIsFocused(true);
    if (!searchTerm.trim()) {
      setFilteredPeople(peopleFromServer);
    }
  };

  const filterPeople = (search: string) => {
    if (!search.trim()) {
      setFilteredPeople([]);

      return;
    }

    const filtered = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredPeople(filtered);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (selectedPerson && selectedPerson.name !== value) {
      setSelectedPerson(null);
    }

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeoutId = setTimeout(() => {
      filterPeople(value);
    }, 300);

    setDebounceTimeout(timeoutId);

    setSearchTerm(value);
  };

  const handlePersonSelect = (person: Person) => {
    setSearchTerm(person.name);
    setSelectedPerson(person);

    if (onSelected) {
      onSelected(person);
    }
  };

  const handleSearchBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      setFilteredPeople([]);
    }, 200);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {isFocused && !searchTerm.trim() ? (
                // Показуємо всіх людей, коли сфокус і порожньо
                peopleFromServer.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handlePersonSelect(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              ) : filteredPeople.length > 0 ? (
                // Показуємо відфільтрованих людей
                filteredPeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handlePersonSelect(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              ) : searchTerm.trim() ? (
                // Показуємо "No matching suggestions", коли є текст, але немає результатів
                <div className="dropdown-item">
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Показуємо повідомлення тільки коли потрібно */}
        {filteredPeople.length === 0 && searchTerm.trim() && (
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
