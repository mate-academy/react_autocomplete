import { useEffect, useState } from 'react';
import { Person } from '../types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected?: (person: Person | null) => void;
  delay: number;
  select: Person | null;
  onNoMatchingSuggestions?: (hasError: boolean) => void;
}

export const Autocomlete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  delay = 300,
  select,
  onNoMatchingSuggestions,
}) => {
  const [input, setInput] = useState('');
  const [applyInput, setApplyInput] = useState('');

  const [sugestion, setSugestion] = useState<Person[]>([]);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setApplyInput(input);
    }, delay);

    return () => clearTimeout(timeout);
  }, [input, delay]);

  useEffect(() => {
    if (applyInput.trim() === '') {
      setSugestion(people);
      if (onNoMatchingSuggestions) {
        onNoMatchingSuggestions(false);
      }
    } else {
      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(applyInput.toLowerCase()),
      );

      setSugestion(filtered);

      if (onNoMatchingSuggestions) {
        onNoMatchingSuggestions(filtered.length === 0);
      }
    }
  }, [applyInput, people, onNoMatchingSuggestions]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInput(value);
    setIsActive(true);

    if (value.trim() !== select?.name && onSelected) {
      onSelected(null);
    }
  };

  const handleSelectPerson = (person: Person) => {
    setInput(person.name);
    setSugestion([]);
    setIsActive(false);

    if (onSelected) {
      onSelected(person);

      if (onNoMatchingSuggestions) {
        onNoMatchingSuggestions(false);
      }
    }
  };

  const handleActive = () => {
    setIsActive(true);
    setSugestion(input.trim() === '' ? people : sugestion);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsActive(false);

      if (input && !sugestion.some(person => person.name === input)) {
        if (onNoMatchingSuggestions) {
          onNoMatchingSuggestions(true);
        }
      }
    }, 300);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={input}
          onChange={handleInput}
          onFocus={handleActive}
          onBlur={handleBlur}
        />
      </div>

      {isActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {sugestion.length > 0 ? (
              sugestion.map(person => (
                <a
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => handleSelectPerson(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </a>
              ))
            ) : (
              <div className="dropdown-item">No matching suggestions</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
