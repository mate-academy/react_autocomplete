import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
type Props = {
  people: Person[];
  delay?: number; // робимо необовʼязковим
  onSelected: (p: Person | null) => void;
};

const AutocompleteComponent: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  // const [fillteredPeople, setFilteredPeople] = useState<Person[]>([...people]);
  const [query, setQuery] = useState('');
  const [applyQueary, setApplyQueary] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedApplyQuery = useCallback(debounce(setApplyQueary, delay), [
    delay,
  ]);

  const filteredPeople = useMemo(() => {
    if (applyQueary === '') {
      return [...people];
    }

    return [...people].filter(p =>
      p.name.toLowerCase().includes(applyQueary.toLowerCase()),
    );
  }, [applyQueary, people]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const normalized = value.trim();

      setQuery(value);
      onSelected(null);

      if (normalized === applyQueary) {
        return;
      }

      debouncedApplyQuery(normalized);
    },
    [applyQueary, onSelected, debouncedApplyQuery],
  );

  const handleInputFocus = useCallback(() => {
    setIsDropdownOpen(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setTimeout(() => setIsDropdownOpen(false), 0);
  }, []);

  const handleOptionSelect = useCallback(
    (person: Person) => {
      setQuery(person.name);
      debouncedApplyQuery(person.name.trim());
      setIsDropdownOpen(false);
      onSelected(person);
    },
    [onSelected, debouncedApplyQuery],
  );

  return (
    <>
      <div className={classNames('dropdown', { 'is-active': isDropdownOpen })}>
        <div className="dropdown-trigger">
          <input
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
          />
        </div>
        {filteredPeople.length !== 0 && isDropdownOpen && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => {
                return (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onMouseDown={() => handleOptionSelect(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {filteredPeople.length === 0 && applyQueary && (
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

export const Autocomplete = React.memo(AutocompleteComponent);
