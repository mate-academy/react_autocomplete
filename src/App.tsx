import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { useEffect, useState } from 'react';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

  useEffect(() => {
    // 1. Встановлюємо таймер setTimeout, який оновить debouncedQuery через delay мілісекунд
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // Тут замість 300 згодом будемо використовувати значення з props.delay

    // 2. Повертаємо функцію очищення (cleanup function)
    return () => {
      clearTimeout(handler); // Скасовуємо таймер, якщо користувач натисне наступну клавішу раніше, ніж мине 300 мс
      // якщо користувач натисне наступну клавішу раніше, ніж мине 300 мс?
    };
  }, [query]); // Ефект спрацьовує щоразу, коли змінюється текст 'query'

  const filteredPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {!selectedPerson
            ? 'No selected person'
            : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>

        <div // Замість статичного класу додаємо динамічну перевірку станів
          className={`dropdown ${isFocused || query ? 'is-active' : ''}`}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setSelectedPerson(null);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {/* If no suggestions show message */}
              {filteredPeople.length === 0 ? (
                <div className="dropdown-item">
                  <p
                    className="has-text-danger"
                    data-cy="no-suggestions-message"
                  >
                    No matching suggestions
                  </p>
                </div>
              ) : (
                // Якщо люди є, перебираємо їх через .map()
                filteredPeople.map(person => (
                  <div
                    key={person.slug} // Кожен елемент списку в React обов'язково повинен мати унікальний key
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    // Додаємо обробник події для вибору людини зі списку
                    onMouseDown={() => {
                      setQuery(person.name); // Записуємо повне ім'я в інпут пошуку
                      setSelectedPerson(person); // Зберігаємо об'єкт вибраної особи у стан
                      setIsFocused(false); // Закриваємо випадаючий список пропозицій
                    }}
                    style={{ cursor: 'pointer' }} // Робимо курсор миші у вигляді вказівника
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
