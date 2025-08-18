import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.scss'; // Припускається, що у вас є App.scss для базових стилів

import { peopleFromServer } from './data/people'; // Ваше джерело даних
import { Person } from './types/Person'; // Ваш інтерфейс Person

// Визначаємо пропси для компонента App, включаючи настроювану затримку debounce
interface AppProps {
  debounceDelay?: number; // Опціональний пропс для затримки debounce, за замовчуванням 300мс
}

export const App: React.FC<AppProps> = ({ debounceDelay = 300 }) => {
  // Стан для тексту, що зараз знаходиться в полі введення
  const [searchText, setSearchText] = useState<string>('');
  // Стан для списку пропозицій, які потрібно відобразити
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  // Стан для людини, явно обраної користувачем
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  // Стан для керування видимістю випадаючого списку пропозицій
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false);
  // Стан для відстеження, чи немає відповідних пропозицій
  const [noMatchingSuggestions, setNoMatchingSuggestions] = useState<boolean>(false);

  // Ref для зберігання ID таймера debounce
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Ref для елемента вводу, щоб керувати фокусом (опціонально, але добре для керування фокусом)
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Ref для контейнера пропозицій, щоб обробляти кліки поза ним
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  // Функція для фільтрації людей на основі тексту пошуку
  const filterPeople = useCallback((text: string) => {
    if (!text) {
      // Якщо текст порожній, показуємо всіх людей (коли поле вводу сфокусоване або просто спочатку)
      return peopleFromServer;
    }
    // Фільтруємо за ім'ям (без урахування регістру)
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(text.toLowerCase())
    );
  }, []); // filterPeople не залежить від жодного зовнішнього стану, тому немає залежностей

  // Ефект для логіки debounce та фільтрації
  useEffect(() => {
    // Очищаємо будь-який попередній тайм-аут debounce
    if (debounceTimeoutRef.current !== null) {
      clearTimeout(debounceTimeoutRef.current as NodeJS.Timeout);
    }

    // Встановлюємо новий тайм-аут
    debounceTimeoutRef.current = setTimeout(() => {
      // Запускаємо фільтрацію, лише якщо текст пошуку дійсно змінився
      // з моменту останнього завершення debounce або якщо вибір було очищено.
      // Нам потрібно порівняти поточний searchText з тим, що використовувався раніше для фільтрації.
      // Для простоти тут ми завжди будемо фільтрувати після debounce, але ви можете оптимізувати,
      // зберігаючи останній відфільтрований текст.

      const filtered = filterPeople(searchText);
      setSuggestions(filtered);
      setNoMatchingSuggestions(filtered.length === 0 && searchText.length > 0);

      // Якщо є текст, відкриваємо пропозиції, інакше закриваємо
      if (searchText.length > 0) {
        setIsSuggestionsOpen(true);
      } else if (searchText.length === 0 && inputRef.current) { // Перевіряємо наявність inputRef.current
        // ЗМІНА: Перевіряємо, чи є document.activeElement екземпляром HTMLInputElement
        // і чи він є тим самим, що і inputRef.current
        if (document.activeElement instanceof HTMLInputElement && document.activeElement === inputRef.current) {
          // Показуємо всі пропозиції, коли поле вводу порожнє та сфокусоване
          setSuggestions(peopleFromServer);
          setIsSuggestionsOpen(true);
        } else {
          setIsSuggestionsOpen(false);
        }
      } else {
        setIsSuggestionsOpen(false);
      }

    }, debounceDelay);

    // Функція очищення: очищаємо тайм-аут при розмонтуванні компонента або зміні залежностей
    return () => {
      if (debounceTimeoutRef.current !== null) {
        clearTimeout(debounceTimeoutRef.current as NodeJS.Timeout);
      }
    };
  }, [searchText, debounceDelay, filterPeople]); // Залежності: searchText та debounceDelay

  // Ефект для обробки кліків поза випадаючим списком пропозицій
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Присвоюємо поточні значення рефів тимчасовим змінним,
      // щоб допомогти TypeScript з звуженням типів та уникнути помилки "Qualifier of 'contains' is possibly null"
      const inputElement = inputRef.current;
      const suggestionsElement = suggestionsRef.current;

      // Перевіряємо, що обидва елементи існують, перш ніж перевіряти, чи міститься цільова подія в них
      if (inputElement && suggestionsElement) {
        if (
          !inputElement.contains(event.target as Node) &&
          !suggestionsElement.contains(event.target as Node)
        ) {
          setIsSuggestionsOpen(false);
          setNoMatchingSuggestions(false); // Очищаємо повідомлення про відсутність збігів при втраті фокусу
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Обробник змін у полі введення
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setSearchText(newText);
    // Якщо текст у полі введення змінюється, очищаємо будь-яку раніше обрану людину
    if (selectedPerson) {
      setSelectedPerson(null);
    }
  };

  // Обробник фокусування на полі введення
  const handleInputFocus = () => {
    setIsSuggestionsOpen(true);
    // Якщо поле вводу порожнє при фокусі, негайно показуємо всі пропозиції
    if (searchText.length === 0) {
      setSuggestions(peopleFromServer);
      setNoMatchingSuggestions(false);
    }
  };

  // Обробник кліку на пропозиції
  const handleSuggestionClick = (person: Person) => {
    setSearchText(person.name); // Встановлюємо текст поля вводу як ім'я обраної людини
    setSelectedPerson(person); // Встановлюємо обрану людину
    setIsSuggestionsOpen(false); // Закриваємо список пропозицій
    setNoMatchingSuggestions(false); // Очищаємо повідомлення про відсутність збігів
    // Ви можете передати це в пропс onSelected, якщо App був дочірнім компонентом
    // У цьому прикладі ми безпосередньо оновлюємо стан App.
    // console.log('Людина обрана:', person); // Для налагодження
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="field">
          <label htmlFor="autocompleteInput">Пошук особи</label>
          <div className="control is-expanded">
            <input
              ref={inputRef}
              type="text"
              id="autocompleteInput"
              placeholder="Введіть частину імені"
              className="input"
              data-cy="search-input"
              value={searchText}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              // onBlur обробляється слухачем подій документа
            />
          </div>

          {isSuggestionsOpen && (
            <div className="suggestions-dropdown" ref={suggestionsRef} data-cy="suggestions-list">
              {suggestions.length > 0 ? (
                <ul>
                  {suggestions.map(person => (
                    <li
                      key={person.slug} // Використовуємо slug як унікальний ключ
                      className="suggestion-item"
                      data-cy="suggestion-item"
                      onClick={() => handleSuggestionClick(person)}
                    >
                      {person.name}
                    </li>
                  ))}
                </ul>
              ) : (
                noMatchingSuggestions && (
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
                    <p className="has-text-danger">Немає відповідних пропозицій</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
