import React, { useCallback, useMemo, useState } from 'react';
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

  const searchPerson = query.trim().toLowerCase();

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      person.name.toLowerCase().includes(searchPerson)));
  }, [peopleFromServer, appliedQuery]);

  const applyQuery = useCallback(debounce((value: string) => {
    setAppliedQuery(value);
    setIsInputFocused(true);
  }, delay), [delay]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const handleSuggestionClick = (selectedPerson: Person) => {
    setQuery(selectedPerson.name);
    onSelected(selectedPerson);
  };

  return (
    <>
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

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length ? (
              filteredPeople.map((person) => (
                <a
                  className="dropdown-item"
                  key={person.name}
                  href="/"
                  onMouseDown={() => handleSuggestionClick(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </a>
              ))
            ) : (
              <p className="dropdown-item">No matching suggestions</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
