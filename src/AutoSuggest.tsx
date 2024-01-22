import React, { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

type Props = {
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const AutoSuggest: React.FC<Props> = ({
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const searchPerson = appliedQuery.trim().toLowerCase();

  const debouncedApplyQuery = useMemo(() => debounce(
    setAppliedQuery, delay,
  ),
  [delay]);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(searchPerson)
    ));
  }, [searchPerson]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedApplyQuery(e.target.value);
  };

  const handleSuggestionClick = (selectedPerson: Person) => {
    setQuery(selectedPerson.name);
    onSelected(selectedPerson);
    setAppliedQuery(selectedPerson.name);
  };

  return (
    <div className={cn('dropdown', { 'is-active': isInputFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onBlur={() => setIsInputFocused(false)}
          onFocus={() => setIsInputFocused(true)}
        />
      </div>

      {isInputFocused && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.map((person) => (
              <a
                className="dropdown-item"
                key={person.name}
                href="/"
                onMouseDown={() => handleSuggestionClick(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </a>
            ))}
            {filteredPeople.length === 0 && (
              <p className="dropdown-item">No matching suggestions</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
