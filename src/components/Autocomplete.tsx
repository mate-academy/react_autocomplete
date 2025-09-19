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
      if (value !== previousValue) {
        onSearchTermChange(value);
        setPreviousValue(value);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, previousValue, delay, onSearchTermChange]);

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isFocused && !isEmpty,
        })}
        onBlur={() => setIsFocused(false)}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={value}
            onChange={handleOnInputChange}
            onFocus={() => setIsFocused(true)}
          />
        </div>
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {people.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onMouseDown={() => {
                  setValue(person.name);
                  onSelected(person);
                }}
                style={{ cursor: 'pointer' }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isEmpty && (
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
Autocomplete.displayName = 'Autocomplete';
