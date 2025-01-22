import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<null | {
    name: string;
    born: number;
    died: number;
  }>(null); // Обрана людина

  // Фільтрація списку
  const filteredPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  // Перевірка чи повністю збігається ім'я
  // const exactMatch = peopleFromServer.find(
  //   person => person.name.toLowerCase() === query.toLowerCase(),
  // );

  // Вибір елемента
  const handleSelect = (person: {
    name: string;
    born: number;
    died: number;
  }) => {
    setSelectedItem(person);
    setQuery(person.name);
    setIsDropdownOpen(false);
  };

  // Функія на перевірку імені
  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (
      !filteredPeople.some(
        person => person.name.toLowerCase() === value.toLowerCase(),
      )
    ) {
      setSelectedItem(null);
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedItem
            ? `${selectedItem.name} (${selectedItem.born} - ${selectedItem.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={e => handleQueryChange(e.target.value)}
            />
          </div>

          {isDropdownOpen && filteredPeople.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSelect(person)}
                    key={person.slug}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isDropdownOpen && filteredPeople.length === 0 && (
            <div
              className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start"
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
