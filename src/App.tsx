import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.scss';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  debounceDelay?: number;
  onSelected?: (person: Person) => void;
}

export const App: React.FC<AppProps> = ({
  debounceDelay = 300,
  onSelected,
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [noMatchingSuggestions, setNoMatchingSuggestions] =
    useState<boolean>(false);

  // ✅ універсальний тип для setTimeout (працює і в браузері, і в Node)
  const debounceTimeoutRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Зберігаємо останній оброблений пошук (trimmed)
  const lastProcessedSearchText = useRef('');

  const filterPeople = useCallback((text: string) => {
    if (!text) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(text.toLowerCase()),
    );
  }, []);

  // 🔹 debounce + фільтрація
  useEffect(() => {
    if (debounceTimeoutRef.current > 0) {
      window.clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      const trimmedSearchText = searchText.trim();

      // Якщо інпут пустий
      if (trimmedSearchText === '' && lastProcessedSearchText.current === '') {
        setSuggestions(isInputFocused ? peopleFromServer : []);
        setNoMatchingSuggestions(false);
        setIsSuggestionsOpen(isInputFocused);
        lastProcessedSearchText.current = trimmedSearchText;

        return;
      }

      // Якщо текст не змінився — нічого не робимо
      if (trimmedSearchText === lastProcessedSearchText.current) {
        return;
      }

      const filtered = filterPeople(trimmedSearchText);

      setSuggestions(filtered);
      setNoMatchingSuggestions(filtered.length === 0);
      setIsSuggestionsOpen(true);

      lastProcessedSearchText.current = trimmedSearchText;
    }, debounceDelay);

    return () => {
      if (debounceTimeoutRef.current > 0) {
        window.clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = 0;
      }
    };
  }, [searchText, debounceDelay, filterPeople, isInputFocused]);

  // 🔹 Закриття при кліку поза списком
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = dropdownRef.current;

      if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
        setIsInputFocused(false);
        setNoMatchingSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 🔹 Зміна тексту
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;

    setSearchText(newText);
    if (selectedPerson) {
      setSelectedPerson(null);
    }
  };

  // 🔹 Фокус на інпуті
  const handleInputFocus = () => {
    setIsInputFocused(true);

    if (searchText.trim().length === 0) {
      setSuggestions(peopleFromServer);
      setNoMatchingSuggestions(false);
    }

    setIsSuggestionsOpen(true);
  };

  // 🔹 Клік по елементу
  const handleSuggestionClick = (person: Person) => {
    setSearchText(person.name);
    setSelectedPerson(person);
    setIsSuggestionsOpen(false);
    setNoMatchingSuggestions(false);
    onSelected?.(person);
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

          <div
            className={`dropdown ${isSuggestionsOpen ? 'is-active' : ''}`}
            ref={dropdownRef}
          >
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
              />
            </div>

            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div
                className="dropdown-content"
                style={{ maxHeight: '200px', overflowY: 'auto' }}
              >
                {suggestions.length > 0 ? (
                  <>
                    {suggestions.map(person => (
                      <a
                        key={person.slug}
                        className="dropdown-item"
                        data-cy="suggestion-item"
                        onClick={e => {
                          e.preventDefault();
                          handleSuggestionClick(person);
                        }}
                      >
                        {person.name}
                      </a>
                    ))}
                  </>
                ) : (
                  noMatchingSuggestions && (
                    <div
                      className="dropdown-item has-text-danger"
                      role="alert"
                      data-cy="no-suggestions-message"
                    >
                      Немає відповідних пропозицій
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
