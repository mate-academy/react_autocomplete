import React, { useEffect, useState, useRef } from 'react';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete = ({ people, delay, onSelected }: Props) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(people);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Referência para gerenciar o timeout de fechamento
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);
    onSelected(null);
  };

  useEffect(() => {
    const delayMs = delay ?? 300;

    if (query.trim() === '') {
      setSuggestions(people);

      return;
    }

    const timerId = setTimeout(() => {
      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()),
      );

      setSuggestions(filtered);
    }, delayMs);

    return () => {
      clearTimeout(timerId);
    };
  }, [query, people, delay]);

  const handleFocus = () => {
    // Limpa qualquer fechamento agendado se o usuário focar novamente
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    setIsDropdownOpen(true);
  };

  const handleBlur = () => {
    // Adiciona um pequeno atraso para permitir cliques na barra de rolagem
    blurTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleSuggestionClick = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {suggestions.length > 0 &&
            suggestions.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onMouseDown={() => handleSuggestionClick(person)}
              >
                <p
                  className={
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                >
                  {person.name}
                </p>
              </div>
            ))}
          {suggestions.length === 0 && query.trim() !== '' && (
            <div className="dropdown-item" data-cy="no-suggestions-message">
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
