import { useState, useEffect, useRef } from 'react';
import { Person } from '../types/Person';

type AutocompleteProps = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [prevQuery, setPrevQuery] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Очищаємо таймер при розмонтуванні
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const trimmedValue = value.trim();

    // Очистка вибраного, якщо текст змінився
    onSelected(null);

    setInputValue(value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (trimmedValue === prevQuery) {
        return;
      }

      setPrevQuery(trimmedValue);

      if (trimmedValue.length === 0) {
        setSuggestions(people);
      } else {
        setSuggestions(
          people.filter(person =>
            person.name.toLowerCase().includes(trimmedValue.toLowerCase())
          ),
        );
      }

      setIsOpen(true);
    }, delay);
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-qa="search-input"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => {
            if (!inputValue.trim()) {
              setSuggestions(people);
            }

            setIsOpen(true);
          }}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-qa="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-qa="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div className="dropdown-item" data-qa="no-suggestions-message">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
