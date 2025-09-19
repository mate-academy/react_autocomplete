import React from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

type AutocompleteProps = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
  onSearchTermChange: (query: string) => void;
};

const AutocompleteComponent: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
  onSearchTermChange,
}) => {
  const isEmpty = people.length === 0;
  const [value, setValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const [previousValue, setPreviousValue] = React.useState('');

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    setValue(inputValue);
    onSelected(null);
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmed = value.trim();

      if (trimmed !== previousValue && trimmed !== '') {
        onSearchTermChange(trimmed);
        setPreviousValue(trimmed);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, previousValue, delay, onSearchTermChange]);

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isFocused,
        })}
        onBlur={() => setIsFocused(false)}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            data-qa="search-input"
            value={value}
            onChange={handleOnInputChange}
            onFocus={() => setIsFocused(true)}
          />
        </div>
        <div
          className="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
          data-qa="suggestions-list"
        >
          <div className="dropdown-content">
            {isEmpty ? (
              <div
                className="notification is-danger is-light"
                role="alert"
                data-cy="no-suggestions-message"
                data-qa="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            ) : (
              people.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  data-qa="suggestion-item"
                  key={person.slug}
                  onMouseDown={() => {
                    setValue(person.name);
                    onSelected(person);
                    setIsFocused(false);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const Autocomplete = React.memo(AutocompleteComponent);
Autocomplete.displayName = 'Autocomplete';
