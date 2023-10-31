import React, { useState, useEffect } from 'react';
import { Person } from './types/Person';

interface Props {
  people: Person[];
  debounceDelay: number;
  onSelected: (person: Person | string) => void;
}

const Autocomplete: React.FC<Props> = ({ people, debounceDelay, onSelected}) => {
  const [query, setQuery] = useState('');
  const [suggestion, setSuggestion] = useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query) {
        const filteredPeople = people.filter((person: Person) =>
          person.name.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestion(filteredPeople);
      } else {
        setSuggestion([]);
      }
      setShowSuggestions(true);
    }, debounceDelay);

    return () => clearTimeout(debounce);
  }, [query, people, debounceDelay]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(false);
  }

  const handleSuggestionClick = (selected: Person) => {
    setQuery(selected.name);
    setShowSuggestions(false);
    onSelected(selected)
  }

  return (
    <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        {showSuggestions && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {suggestion.length === 0 ? (
                <div className="dropdown-item">No matching suggestions</div>
              ) : (
                suggestion.map((person: Person) => (
                  <div
                    className="dropdown-item"
                    key={person.name}
                    onClick={() => handleSuggestionClick(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
  );
}

export default Autocomplete;
