// People.tsx
import { useRef, useState } from 'react';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const People: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [typedText, setTypedText] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousTextRef = useRef('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;

    setTypedText(text);
    onSelected(null); // clear selected person on change

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (text === previousTextRef.current) {
        return;
      }

      previousTextRef.current = text;

      const trimmedText = text.trim();

      if (!trimmedText && text.length > 0) {
        setFilteredPeople([]);
        setIsOpen(true);

        return;
      }

      if (!trimmedText) {
        setFilteredPeople(people);
        setIsOpen(true);

        return;
      }

      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(trimmedText.toLowerCase()),
      );

      setFilteredPeople(filtered);
      setIsOpen(true);
    }, delay);
  };

  const handleFocus = () => {
    setFilteredPeople(people);
    setIsOpen(true);
  };

  const handleSelect = (person: Person) => {
    setTypedText(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  const noResults = typedText.trim().length > 0 && filteredPeople.length === 0;

  return (
    <>
      <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            data-cy="search-input"
            value={typedText}
            type="text"
            placeholder="Enter a part of the name"
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          />
        </div>

        {isOpen && !noResults && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {noResults && (
        <div
          className={[
            'notification',
            'is-danger',
            'is-light',
            'mt-3',
            'is-align-self-flex-start',
          ].join(' ')}
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
