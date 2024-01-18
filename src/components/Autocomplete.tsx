import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  delay: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay,
  onSelected,
}) => {
  const [inputText, setInputText] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const delayedFilter = useCallback(
    debounce((text: string) => {
      const filtered = people.filter(
        (person) => person.name.toLowerCase().includes(text.toLowerCase())
          || person.slug.toLowerCase().includes(text.toLowerCase()),
      );

      setFilteredPeople(filtered);
      setShowSuggestions(true);
    }, delay),
    [people, delay],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    setInputText(newText);
    setShowSuggestions(newText === '');
    delayedFilter(newText);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputText(person.name);
    setShowSuggestions(false);
    onSelected(person);
  };

  useEffect(() => {
    if (!showSuggestions) {
      setFilteredPeople([]);
    }
  }, [showSuggestions]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputText}
          onChange={handleInputChange}
        />
      </div>

      {showSuggestions && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length === 0 ? (
              <div className="dropdown-item">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            ) : (
              filteredPeople.map((person) => (
                <button
                  type="button"
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => handleSuggestionClick(person)}
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
