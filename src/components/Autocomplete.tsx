import { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected?: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [text, setText] = useState('');

  const [debouncedText, setDebouncedText] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(text);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    setIsOpen(true);

    onSelected?.(null);
  };

  const visiblePeople = useMemo(() => {
    const normalaizedText = debouncedText.trim().toLowerCase();

    if (!normalaizedText) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalaizedText),
    );
  }, [people, debouncedText]);

  const selectPerson = (person: Person) => {
    setText(person.name);
    setDebouncedText(person.name);
    setIsOpen(false);

    onSelected?.(person);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          value={text}
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onChange={handleTextChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setIsOpen(false), 200);
          }}
        />
      </div>

      {isOpen && visiblePeople.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onClick={() => selectPerson(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && visiblePeople.length === 0 && (
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
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
