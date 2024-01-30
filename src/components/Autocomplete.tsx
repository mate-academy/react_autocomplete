import React, {
  ChangeEvent, useCallback, useMemo, useState,
} from 'react';
import debounce from 'lodash.debounce';
import 'bulma';
import { peopleFromServer } from '../data/people';

interface AutocompleteProps {
  onSelected: (person: string) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({ onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(user => (
      user.name.toLowerCase().includes(appliedQuery.toLowerCase())
    ));
  }, [appliedQuery]);

  const handleSuggestion = (person: string) => {
    setQuery(person);
    setShowSuggestions(false);
    onSelected(person);
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
            {filterPeople.length > 0 ? (
              filterPeople.map((person) => (
                <button
                  className="dropdown-item"
                  type="button"
                  key={person.slug}
                  onClick={() => handleSuggestion(person.name)}
                >
                  <p className="has-text-link">{person.name}</p>
                </button>
              ))
            ) : (
              <div className="dropdown-item">
                No matching suggestions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// export default Autocomplete;
