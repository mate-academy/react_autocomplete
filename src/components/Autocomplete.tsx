import React, { useEffect, useState, useMemo } from 'react';
// Імпортуємо масив людей із файлу даних, за яким будемо проводити пошук
import { peopleFromServer } from '../data/people';
// Імпортуємо тип (інтерфейс), який описує структуру об'єкта людини
import { Person } from '../types/Person';

// Описуємо типи властивостей (props), які наш компонент приймає ззовні
type AutocompleteProps = {
  // delay — необов'язковий пропс (число), час очікування для дебаунсу
  delay?: number;
  // onSelected — обов'язкова функція-колбек, яка передає вибрану людину наверх у App.tsx
  onSelected: (person: Person) => void;
};

// Експортуємо функцію компонента за замовчуванням, задаючи для delay базове значення 300 мс
export default function Autocomplete({
  delay = 300,
  onSelected,
}: AutocompleteProps) {
  // query — стан для збереження тексту, який користувач вводить в інпут прямо зараз
  const [query, setQuery] = useState<string>('');

  // debouncedQuery — стан для тексту, який оновлюється з затримкою (саме за ним буде фільтрація)
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

  // isFocused — стан, який фіксує, чи знаходиться курсор (фокус) всередині поля введення
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // ⏱ useEffect відстежує зміни тексту query та часу затримки delay
  useEffect(() => {
    // Перевіряємо, чи є в тексті щось крім пробілів за допомогою .trim()
    if (!query.trim()) {
      // Очищаємо відкладений запит, щоб список пропозицій відразу зник
      setDebouncedQuery('');
      // Зупиняємо виконання ефекту (достроковий вихід), щоб не запускати непотрібний таймер

      return;
    }

    // Якщо текст пройшов перевірку, створюємо таймер (setTimeout)
    const handler = setTimeout(() => {
      // Цей код виконається лише тоді, коли користувач перестане друкувати на delay мілісекунд
      setDebouncedQuery(query);
    }, delay);

    // Функція очищення (cleanup). Вона скасовує попередній таймер, якщо користувач натисне клавішу швидше
    return () => clearTimeout(handler);
  }, [query, delay]); // Ефект перезапуститься тільки якщо зміняться ці дві змінні

  //  useMemo кешує (запам'ятовує) результат фільтрації масиву людей
  const filteredPeople = useMemo(() => {
    // Якщо відкладений запит порожній (наприклад, після очищення в useEffect)
    if (!debouncedQuery) {
      // Повертаємо порожній масив, щоб не показувати жодних варіантів
      return [];
    }

    // Якщо запит є, проходимо по масиву людей методом .filter()
    return peopleFromServer.filter(person => {
      // Приводимо до нижнього регістру (.toLowerCase()) для пошуку незалежно від регістру літер
      return person.name.toLowerCase().includes(debouncedQuery.toLowerCase());
    });
  }, [debouncedQuery]); // Фільтрація перераховується ТІЛЬКИ коли змінюється debouncedQuery

  return (
    // Клас 'is-active' додається до dropdown ТІЛЬКИ тоді, коли користувач у фокусі (isFocused)
    <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <div className="control">
          <input
            type="text"
            className="input"
            placeholder="Type to search..."
            data-cy="search-input"
            value={query}
            // Коли користувач пише, оновлюємо стан query
            onChange={event => setQuery(event.target.value)}
            // Коли користувач клікає на інпут, відкриваємо список
            onFocus={() => setIsFocused(true)}
            // Коли користувач клікає в іншому місці, закриваємо список
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {/*
            Повідомлення показуємо ТІЛЬКИ якщо користувач щось ввів (debouncedQuery не порожній),
            але фільтрація повернула порожній масив (filteredPeople.length === 0)
          */}
          {debouncedQuery && filteredPeople.length === 0 ? (
            <div className="dropdown-item">
              <p className="has-text-danger" data-cy="no-suggestions-message">
                No matching suggestions
              </p>
            </div>
          ) : (
            // Якщо люди знайшлися (або інпут порожній), перебираємо масив через .map()
            filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                // Використовуємо onMouseDown замість onClick, щоб вибір спрацював ДО onBlur на інпуті
                onMouseDown={() => {
                  setQuery(person.name); // Записуємо ім'я в інпут
                  onSelected(person); // Передаємо вибрану людину в App.tsx через пропс
                  setIsFocused(false); // Закриваємо список
                }}
                style={{ cursor: 'pointer' }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
