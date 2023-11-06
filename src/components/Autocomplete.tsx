import React, { useState, useMemo, useCallback } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelect?: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 1000,
  onSelect = () => {},
}: Props) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPeople = useMemo(() => {
    setIsLoading(false);

    return people.filter(person => {
      return person.name
        .toLowerCase()
        .includes(appliedQuery.toLowerCase());
    });
  }, [people, appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);

    const inputValue = event.target.value;

    setQuery(inputValue);

    if (!inputValue) {
      onSelect(null);
      setIsLoading(false);
    }

    applyQuery(inputValue);
  };

  const handlePersonSelect = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
  };

  return (
    <div
      className={cn('dropdown', {
        'is-active': isFocused,
      })}
    >
      <div className="dropdown-trigger">
        <div
          className={cn('control', {
            'is-loading': isLoading,
          })}
        >
          <input
            type="text"
            placeholder="Enter a part of the name"
            value={query}
            className="input is-loading"
            onChange={handleQueryChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length
            ? filteredPeople.map(person => (
              <a
                key={person.slug}
                href="/#"
                className="dropdown-item"
                onMouseDown={() => handlePersonSelect(person)}
              >
                <p className="has-text-link">
                  {person.name}
                </p>
              </a>
            )) : (
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
