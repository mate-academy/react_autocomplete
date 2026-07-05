import React, { useEffect, useState, useMemo, useRef } from 'react';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type AutocompleteProps = {
  delay?: number;
  onSelected: (person: Person) => void;
  onInputChange: () => void; // Колбек для сповіщення батьківського компонента про зміни
};

export default function Autocomplete({
  delay = 300,
  onSelected,
  onInputChange,
}: AutocompleteProps) {
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // useRef допомагає запам'ятати попереднє дебаунс-значення, щоб уникнути зайвої фільтрації
  const lastDebouncedValue = useRef<string>(debouncedQuery);

  useEffect(() => {
    // Якщо новий query збігається з останнім дебаунс-значенням, пропускаємо роботу
    if (query === lastDebouncedValue.current) {
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      lastDebouncedValue.current = query; // Оновлюємо реф новим значенням
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay]);

  // Фільтрація: показує всіх людей, якщо інпут порожній або містить лише пробіли
  const filteredPeople = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person => {
      return person.name.toLowerCase().includes(debouncedQuery.toLowerCase());
    });
  }, [debouncedQuery]);

  return (
    <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <div className="control">
          <input
            type="text"
            className="input"
            placeholder="Enter a part of the name" // 🏷️ Точний плейсхолдер за вимогами тестів
            data-cy="search-input"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              onInputChange(); // 🔔 Скидаємо selectedPerson в App.tsx при кожній зміні тексту
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {/*
            Завжди відмальовуємо контейнер suggestions-list, якщо користувач у фокусі,
            як того вимагають тести Cypress
          */}
          {isFocused && (
            <div data-cy="suggestions-list">
              {/* Повідомлення про відсутність результатів показуємо лише коли запит не порожній */}
              {debouncedQuery.trim() && filteredPeople.length === 0 ? (
                <div className="dropdown-item">
                  <p
                    className="has-text-danger"
                    data-cy="no-suggestions-message"
                  >
                    No matching suggestions
                  </p>
                </div>
              ) : (
                filteredPeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onMouseDown={() => {
                      setQuery(person.name);
                      // Оновлюємо реф, щоб зміна query через клік не викликала повторний дебаунс пошуку
                      lastDebouncedValue.current = person.name;
                      setDebouncedQuery(person.name);
                      onSelected(person);
                      setIsFocused(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
