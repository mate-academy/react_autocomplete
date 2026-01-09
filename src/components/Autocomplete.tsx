import { useRef, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  onSelected: (person: Person) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  value,
  delay = 300,
  onSelected,
  onChange,
}) => {
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const prevQueryRef = useRef('');
  const debounceRef = useRef<number>();

  const saveQuery = (newQuery: string) => {
    onChange(newQuery);
    window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      // Якщо input порожній → показуємо всіх людей
      if (!newQuery.trim()) {
        setSuggestions(people);
        setIsOpen(true);
        prevQueryRef.current = '';

        return;
      }

      if (newQuery !== prevQueryRef.current) {
        const filtered = people.filter(person =>
          person.name.toLowerCase().includes(newQuery.toLowerCase()),
        );

        setSuggestions(filtered);
        setIsOpen(true);
        prevQueryRef.current = newQuery;
      }
    }, delay);
  };

  const handleSelect = (person: Person) => {
    window.clearTimeout(debounceRef.current);
    prevQueryRef.current = person.name;

    setIsOpen(false);
    setSuggestions([]);
    onSelected(person);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={value}
          onChange={event => saveQuery(event.target.value)}
          onFocus={() => {
            // Якщо input порожній → показуємо всіх людей на фокус
            if (!value.trim()) {
              setSuggestions(people);
              setIsOpen(true);
            }
          }}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div
                className="
                notification is-danger is-light mt-3 is-align-self-flex-start"
                role="alert"
                data-cy="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
