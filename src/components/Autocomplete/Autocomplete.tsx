import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';

interface Props {
  people: Person[];
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpenList, setIsOpenList] = useState(false);

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  const filteredPeople = useMemo(() => {
    if (!query.trim()) {
      return people;
    }

    const normalizedQuery = appliedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [query, appliedQuery, people]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (newValue === query) {
      return;
    }

    setQuery(newValue);
    onSelected?.(null);
    setIsOpenList(true);

    if (!newValue.trim()) {
      applyQuery.cancel();
      setAppliedQuery('');
    } else {
      applyQuery(newValue);
    }
  };

  const handleSelectPerson = (person: Person) => {
    applyQuery.cancel();
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsOpenList(false);
    onSelected?.(person);
  };

  const showNoSuggestions = isOpenList && filteredPeople.length === 0;

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            data-qa="search-input"
            value={query}
            onFocus={() => setIsOpenList(true)}
            onBlur={() => setIsOpenList(false)}
            onChange={handleQueryChange}
          />
        </div>

        {isOpenList && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map((person: Person) => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  data-qa="suggestion-item"
                  onMouseDown={event => {
                    event.preventDefault();
                    handleSelectPerson(person);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showNoSuggestions && (
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
          data-qa="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
