import { Person } from '../types/Person';
import { useEffect, useState } from 'react';
interface Props {
  person: Person[];
  delay?: number;
  onSelected: (person: Person) => void;
  onInputChange?: () => void;
}

export default function Input({
  person,
  delay = 300,
  onSelected,
  onInputChange,
}: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);

  useEffect(() => {
    const queryLower = query.trim().toLowerCase();

    const timeout = window.setTimeout(() => {
      const nextSuggestions =
        queryLower === ''
          ? person
          : person.filter(pers => pers.name.toLowerCase().includes(queryLower));

      setSuggestions(nextSuggestions);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [query, delay, person]);

  const handleSelect = (selectedPerson: Person) => {
    setQuery(selectedPerson.name);
    setIsOpen(false);
    onSelected(selectedPerson);
  };

  return (
    <div className={isOpen ? 'dropdown is-active' : 'dropdown'}>
      <div className="dropdown-trigger">
        <input
          className="input is-medium"
          type="text"
          placeholder="Enter a part of the name"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
            onInputChange?.();
          }}
          onFocus={() => setIsOpen(true)}
          data-cy="search-input"
        />
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content" data-cy="suggestions-list">
          {query !== '' && suggestions.length === 0 ? (
            <div className="dropdown-item" data-cy="no-suggestions-message">
              No matching suggestions
            </div>
          ) : (
            suggestions.map(pers => (
              <a
                key={pers.slug}
                href="#"
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={e => {
                  e.preventDefault();
                  handleSelect(pers);
                }}
              >
                {pers.name}
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
