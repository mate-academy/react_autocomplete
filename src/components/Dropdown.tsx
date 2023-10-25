/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useCallback } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  peopleFromServer: Person[];
  onSelected: (person: Person) => void;
};

export const Dropdown: React.FC<Props> = ({
  peopleFromServer,
  onSelected,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce((value) => {
      setAppliedQuery(value.trim());
      setIsActive(true);
    }, 1000),
    [setAppliedQuery],
  );

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setIsActive(false);

    setQuery(newQuery);
    applyQuery(newQuery);
  };

  const suggestions = React.useMemo(() => {
    return peopleFromServer.filter(person => {
      const normalizedName = person.name.toLowerCase();
      const normalizedQuery = appliedQuery.trim().toLowerCase();

      return normalizedName.includes(normalizedQuery);
    });
  }, [peopleFromServer, appliedQuery]);

  const handleInputFocus = () => {
    setIsActive(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsActive(false);
    }, 100);
  };

  const handlePersonSelect = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
  };

  return (
    <div className={cn('dropdown', { 'is-active': isActive })}>
      <div
        className="dropdown-trigger"
      >
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          value={query}
          onChange={onInputChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {suggestions.length > 0
            ? (
              suggestions.map(person => (
                <a
                  key={person.slug}
                  className={`dropdown-item ${person.sex === 'm'
                    ? 'has-text-link'
                    : 'has-text-danger'
                  }`}
                  onClick={() => handlePersonSelect(person)}
                >
                  {person.name}
                </a>
              ))
            )
            : (
              <div className="dropdown-item">
                <p>
                  No matching suggestions
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
