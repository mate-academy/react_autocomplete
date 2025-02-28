import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash/debounce';

interface AutocompleteProps {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastInput, setLastInput] = useState(''); // Зберігаємо попереднє значення для порівняння
  const [, setSelectedPerson] = useState<Person | null>(null); // Переміщаємо вгору
  const inputRef = useRef<HTMLInputElement>(null);

  // Створюємо debounce-функцію з інлайн-коллбеком, щоб уникнути проблем із залежностями
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInputChange = useCallback(
    debounce((value: string) => {
      // Ігноруємо фільтрацію, якщо текст складається лише з пробілів
      if (value.trim() === '') {
        setSuggestions([]); // Порожній або лише пробіли — скидаємо підказки
        setLastInput(value);

        return;
      }

      // Не фільтруємо, якщо текст не змінився
      if (value === lastInput) {
        return;
      }

      setLastInput(value);

      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(value.trim().toLowerCase()),
      );

      setSuggestions(filtered.length > 0 ? filtered : []);
    }, delay),
    [people, delay],
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);
    setSelectedPerson(null); // Очищаємо вибрану людину, якщо текст змінюється
    onSelected(null); // Очищаємо в App
    handleInputChange(value);
    setIsOpen(true);
  };

  const onFocus = () => {
    if (inputValue.trim() === '') {
      setSuggestions(people);
      setIsOpen(true);
    }
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setSuggestions([]);
    setIsOpen(false);
    onSelected(person); // Передаємо вибрану людину в App
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`dropdown ${isOpen ? 'is-active' : ''}`}
      data-cy="autocomplete"
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={onChange}
          onFocus={onFocus}
          ref={inputRef}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {suggestions.length > 0 ? (
            suggestions.map(person => (
              <div
                key={`${person.name}-${person.born}`} // Використовуємо унікальну комбінацію name і born
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                <p
                  className={
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                >
                  {person.name}
                </p>
              </div>
            ))
          ) : inputValue.trim() !== '' ? (
            <div className="dropdown-item" data-cy="no-suggestions-message">
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
