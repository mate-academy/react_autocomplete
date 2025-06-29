import React, { useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { AutocompleteProps } from '../../types/Autocomplete';
import { Person } from '../../types/Person';

const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);

  const prevQueryRef = useRef('');

  useEffect(() => {
    if (query === prevQueryRef.current) {
      return;
    }

    const debounced = debounce(() => {
      prevQueryRef.current = query;

      const filtered = query.trim()
        ? people.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        : people;

      setSuggestions(filtered);
    }, delay);

    debounced();

    return () => {
      debounced.cancel();
    };
  }, [query, people, delay]);

  let suggestionsContent;

  if (suggestions.length > 0) {
    suggestionsContent = suggestions.map(person => (
      <div
        key={person.name}
        className="dropdown-item"
        data-cy="suggestion-item"
        onMouseDown={e => {
          e.preventDefault();
          setQuery(person.name);
          onSelected(person);
          setIsOpen(false);
        }}
      >
        <p className="has-text-link">{person.name}</p>
      </div>
    ));
  } else if (query.trim() !== '') {
    suggestionsContent = (
      <div
        className="
        notification is-danger is-light mt-3 is-align-self-flex-start"
        role="alert"
        data-cy="no-suggestions-message"
      >
        <p className="has-text-danger">No matching suggestions</p>
      </div>
    );
  } else {
    suggestionsContent = null;
  }

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          placeholder="Enter a part of the name"
          data-cy="search-input"
          onChange={e => {
            setIsOpen(true);
            setQuery(e.target.value);
            onSelected(null);
          }}
          onFocus={() => {
            setIsOpen(true);
            if (!query.trim()) {
              setSuggestions(people);
            }
          }}
          onBlur={() => setTimeout(() => setIsOpen(false), 600)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">{suggestionsContent}</div>
      </div>
    </div>
  );
};

export default Autocomplete;
