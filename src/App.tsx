import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState(''); // Текст в поле ввода
  const [debouncedQuery, setDebouncedQuery] = useState(''); // Дебаунс версия query
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Фильтрация по debouncedQuery
  const filteredPeople: Person[] = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(debouncedQuery.trim().toLowerCase()),
  );

  // Обновление debouncedQuery с задержкой
  useEffect(() => {
    const handler = debounce(() => setDebouncedQuery(query), 300);

    handler();

    return () => handler.cancel();
  }, [query]);

  // Обработка выбора человека
  const handleSelectedChange = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name); // Установить имя в поле ввода
    setIsActive(false); // Закрыть dropdown
  };

  // Обработка потери фокуса
  const handleBlur = () => {
    setTimeout(() => setIsActive(false), 200);
  };

  // Сброс выбранного человека при изменении текста
  useEffect(() => {
    if (selectedPerson && query !== selectedPerson.name) {
      setSelectedPerson(null);
    }
  }, [query, selectedPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isActive ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              value={query} // Значение для input
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onChange={e => setQuery(e.target.value)} // Мгновенное обновление query
              onFocus={() => setIsActive(true)} // Открытие dropdown при фокусе
              onBlur={handleBlur} // Закрытие dropdown при потере фокуса
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item has-text-link"
                  onClick={() => handleSelectedChange(person)} // Выбор человека
                  data-cy="suggestion-item"
                >
                  {person.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && query.trim() && (
          <div
            className="
            notification is-danger is-light mt-3 is-align-self-flex-start"
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
