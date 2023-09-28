import React, { useState, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

type Props = {
  delay: number,
  onSelected: (person: Person) => void;
};

export const Autocomplete: React.FC<Props> = ({ delay, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [elementsVisible, setElementsVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const peopleFilteredByName = useMemo(() => {
    const lowerQuery = appliedQuery.toLowerCase();

    setElementsVisible(true);

    return peopleFromServer.filter(person => {
      const lowerName = person.name.toLowerCase();

      return lowerName.includes(lowerQuery);
    });
  }, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setElementsVisible(false);
  };

  const handleClick = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setElementsVisible(false);
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
          onFocus={() => setFocused(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {(elementsVisible && focused) && (
          <div className="dropdown-content">
            {(peopleFilteredByName.length === 0) ? (
              <button type="button" className="dropdown-item">
                No matching suggestions
              </button>
            ) : (
              <div>
                {peopleFilteredByName.map(person => (
                  <button
                    key={person.name}
                    type="button"
                    className="dropdown-item"
                    onClick={() => handleClick(person)}
                  >
                    <p className="has-text-link">
                      {person.name}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
