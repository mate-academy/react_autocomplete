import React, { useState, useEffect } from 'react';
import { Person } from './types/Person';

interface Props {
  people: Person[];
  debounceDelay: number;
  onSelected: (person: Person | string) => void;
}

const Autocomplete: React.FC<Props> = (
  { people, debounceDelay, onSelected },
) => {
  const [query, setQuery] = useState('');
  const [suggestion, setSuggestion] = useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query) {
        const filteredPeople = people.filter(
          (person: Person) => person.name
            .toLowerCase()
            .includes(query.toLowerCase()),
        );

        setSuggestion(filteredPeople);
      } else {
        setSuggestion(people);
      }

      if (isFocused === true) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, debounceDelay);

    return () => clearTimeout(debounce);
  }, [query, people, debounceDelay]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setQuery(newValue);
    setShowSuggestions(false);
    setIsFocused(true);

    if (newValue.length === 0) {
      onSelected('');
    }
  };

  const handleSuggestionClick = (selected: Person) => {
    setQuery(selected.name);
    setShowSuggestions(false);
    onSelected(selected);

    setSuggestion([]);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setShowSuggestions(true)}
        />
      </div>

      {showSuggestions && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {suggestion.length === 0 ? (
              <div className="dropdown-item">No matching suggestions</div>
            ) : (
              suggestion.map((person: Person) => (
                <button
                  type="button"
                  className="dropdown-item"
                  key={person.name}
                  onClick={() => {
                    handleSuggestionClick(person);
                    setIsFocused(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
