import React, { useState, useEffect } from 'react';
import { Person } from '../types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  debounceTime?: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  debounceTime = 300,
}) => {
  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastSearched, setLastSearched] = useState('');

  useEffect(() => {
    // Verifica se a consulta foi alterada antes de disparar a busca
    if (query === lastSearched) {
      return;
    }

    const handler = setTimeout(() => {
      if (query.trim() === '') {
        setFilteredPeople([]); // Não mostrar sugestões quando a query for vazia
      } else {
        setFilteredPeople(
          people.filter(person =>
            person.name.toLowerCase().includes(query.toLowerCase()),
          ),
        );
      }

      setLastSearched(query);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [query, people, debounceTime, lastSearched]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    setShowDropdown(true);
    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setShowDropdown(false);
    onSelected(person);
  };

  return (
    <div className={`dropdown ${showDropdown ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </div>
      {showDropdown && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div
                  key={person.slug} // Usando person.slug como chave única, se for garantido
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div className="dropdown-item" data-cy="no-suggestions-message">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
