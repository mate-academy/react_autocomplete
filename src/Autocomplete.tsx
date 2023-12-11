import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

type Props = {
  people: Person[];
  delay: number;
  onSelected: (person: Person | undefined) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocesed] = useState(false);

  const filteredSuggestions = useMemo(() => {
    return people.filter(person => person.name.toLowerCase()
      .includes(appliedQuery.trim().toLowerCase()));
  }, [appliedQuery, people]);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleFocus = () => {
    setIsFocesed(true);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSuggestionOnClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person | undefined,
  ) => {
    event.preventDefault();

    if (person) {
      setQuery(person?.name);
    }

    onSelected(person);
    setIsFocesed(false);
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
          onFocus={handleFocus}
        />
      </div>

      {isFocused && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">

            {filteredSuggestions.length ? (
              filteredSuggestions.map((person) => (
                <a
                  className="dropdown-item"
                  href="/"
                  key={person.slug}
                  onClick={(event) => handleSuggestionOnClick(event, person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </a>
              ))
            ) : (
              <p className="dropdown-item">No matching suggestions</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
