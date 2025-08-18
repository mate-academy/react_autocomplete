import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.scss'; // Припускається, що у вас є App.scss для базових стилів

import { peopleFromServer } from './data/people'; // Ваше джерело даних
import { Person } from './types/Person'; // Ваш інтерфейс Person

// Визначаємо пропси для компонента App, включаючи настроювану затримку debounce
interface AppProps {
  debounceDelay?: number; // Опціональний пропс для затримки debounce, за замовчуванням 300мс
  onSelected?: (person: Person) => void; // Додано: зворотний виклик, що спрацьовує при виборі особи
}

export const App: React.FC<AppProps> = ({ debounceDelay = 300, onSelected }) => {
  // Стан для тексту, що зараз знаходиться в полі введення
  const [searchText, setSearchText] = useState<string>('');
  // Стан для списку пропозицій, які потрібно відобразити
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  // Стан для людини, явно обраної користувачем
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  // Стан для керування видимістю випадаючого списку пропозицій (повністю контролює клас 'is-active' Bulma)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false);
  // Стан для відстеження, чи сфокусоване поле вводу (замінює document.activeElement)
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  // Стан для відстеження, чи немає відповідних пропозицій
  const [noMatchingSuggestions, setNoMatchingSuggestions] = useState<boolean>(false);

  // Ref для зберігання ID таймера debounce
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Ref для елемента вводу
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Ref для всього контейнера Bulma dropdown, щоб обробляти кліки поза ним
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // Ref для зберігання тексту, який був останній раз оброблений фільтрацією (для запобігання повторної фільтрації)
  const lastProcessedSearchText = useRef('');

  // Функція для фільтрації людей на основі тексту пошуку
  const filterPeople = useCallback((text: string) => {
    // Якщо текст порожній, повертаємо всіх людей
    if (!text) {
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
      const trimmedSearchText = searchText.trim(); // Обрізаємо пробіли з тексту пошуку

      // Не запускаємо фільтрацію, якщо обрізаний текст порожній (містить лише пробіли)
      // АБО якщо текст пошуку не змінився з моменту останнього фільтру
      if (trimmedSearchText === '' && lastProcessedSearchText.current.trim() === '') {
        // Якщо текст порожній, але інпут сфокусований, показуємо всі пропозиції
        setSuggestions(isInputFocused ? peopleFromServer : []);
        setNoMatchingSuggestions(false);
        setIsSuggestionsOpen(isInputFocused); // Видимість залежить від фокусу інпута
        lastProcessedSearchText.current = searchText; // Оновлюємо останній оброблений текст
        return; // Завершуємо виконання
      }

      // Не запускаємо фільтрацію, якщо текст не змінився з моменту останнього оброблення
      if (searchText === lastProcessedSearchText.current) {
        return;
      }

      const filtered = filterPeople(trimmedSearchText);
      setSuggestions(filtered);
      setNoMatchingSuggestions(filtered.length === 0);
      setIsSuggestionsOpen(true); // Завжди відкриваємо список, якщо є непустий текст

      lastProcessedSearchText.current = searchText; // Оновлюємо останній оброблений текст
    }, debounceDelay);

    // Функція очищення: очищаємо тайм-аут при розмонтуванні компонента або зміні залежностей
    return () => {
      if (debounceTimeoutRef.current !== null) {
        clearTimeout(debounceTimeoutRef.current as NodeJS.Timeout);
      }
    };
  }, [searchText, debounceDelay, filterPeople, isInputFocused]); // isInputFocused додано до залежностей

  // Ефект для обробки кліків поза випадаючим списком (для закриття)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // --- ЗМІНА ПОЧАТОК ---
      // Присвоюємо поточне значення ref локальній змінній для звуження типу.
      const dropdownElement = dropdownRef.current;

      // Якщо клік відбувся поза межами всього Bulma-dropdown контейнера,
      // закриваємо список пропозицій і знімаємо фокус з інпута
      if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
        setIsSuggestionsOpen(false); // Закриваємо список пропозицій
        setIsInputFocused(false); // Знімаємо фокус з інпута
        setNoMatchingSuggestions(false); // Очищаємо повідомлення про відсутність збігів
      }
      // --- ЗМІНА КІНЕЦЬ ---
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
    setIsInputFocused(true); // Встановлюємо фокус на інпут
    // Якщо поле вводу порожнє при фокусі, негайно показуємо всіх
    if (searchText.length === 0) {
      setSuggestions(peopleFromServer);
      setNoMatchingSuggestions(false);
    }
    setIsSuggestionsOpen(true); // Завжди відкриваємо список пропозицій при фокусі
  };

  // Обробник кліку на пропозиції
  const handleSuggestionClick = (person: Person) => {
    setSearchText(person.name); // Встановлюємо текст поля вводу як ім'я обраної людини
    setSelectedPerson(person); // Встановлюємо обрану людину
    setIsSuggestionsOpen(false); // Закриваємо список пропозицій
    setNoMatchingSuggestions(false); // Очищаємо повідомлення про відсутність збігів
    onSelected?.(person); // Викликаємо зворотний виклик onSelected, якщо він наданий
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
          {/* Bulma dropdown контейнер */}
          <div className={`dropdown ${isSuggestionsOpen ? 'is-active' : ''}`} ref={dropdownRef}>
            <div className="dropdown-trigger" style={{ width: '100%' }}>
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
                onBlur={() => setIsInputFocused(false)} // Оновлюємо стан фокусу інпута при втраті
              />
            </div>

            {/* Bulma dropdown-menu, який містить список пропозицій */}
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {suggestions.length > 0 ? (
                  <> {/* Фрагмент для групування елементів випадаючого списку Bulma */}
                    {suggestions.map(person => (
                      <a
                        key={person.slug}
                        href="#" // Bulma dropdown-item зазвичай є <a>
                        className="dropdown-item"
                        data-cy="suggestion-item"
                        onClick={(e) => { e.preventDefault(); handleSuggestionClick(person); }} // Запобігаємо переходу за посиланням
                      >
                        {person.name}
                      </a>
                    ))}
                  </>
                ) : (
                  noMatchingSuggestions && (
                    <div
                      className="dropdown-item notification is-danger is-light mt-3 is-align-self-flex-start"
                      role="alert"
                      data-cy="no-suggestions-message"
                    >
                      <p className="has-text-danger">Немає відповідних пропозицій</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
