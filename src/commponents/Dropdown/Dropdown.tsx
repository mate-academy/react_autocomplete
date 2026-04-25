import React, { useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';

interface Props {
  delay?: number;
  onSelected: (persone: Person | null) => void;
  peopleData: Person[];
}

export const Dropdown: React.FC<Props> = ({
  delay = 300,
  onSelected,
  peopleData,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    if (event.target.value.trim() !== query) {
      applyQuery(event.target.value);
    }

    onSelected(null);
  };

  const handleClick = (persone: Person) => {
    applyQuery.cancel();

    onSelected(persone);
    setQuery(persone.name);
    setAppliedQuery('');

    setIsFocused(false);
  };

  const filteredPeople = useMemo(() => {
    return peopleData.filter(people =>
      people.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, peopleData]);

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            value={query}
            onChange={event => handleChange(event)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 200);
            }}
            className="input"
            data-cy="search-input"
          />
        </div>

        {(isFocused || appliedQuery) && filteredPeople.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(people => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={people.slug}
                  onClick={() => handleClick(people)}
                >
                  <p className="has-text-link">{people.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredPeople.length === 0 && appliedQuery && (
        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
            "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
