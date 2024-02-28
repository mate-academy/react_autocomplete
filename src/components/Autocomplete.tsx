import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  delay: number;
  people: Person[];
  selectedPerson: Person | null;
  selectPerson: (item: Person | null) => void;
  aplyQuery: (query: string) => void;
};

export const Autocomplete: React.FC<Props> = ({
  delay = 300,
  people,
  selectedPerson,
  selectPerson,
  aplyQuery,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const applyQuery = debounce(aplyQuery, delay);

  const handleFocused = () => {
    setIsFocused(true);
  };

  const checFocus = debounce(handleFocused, delay);

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, delay);
  };

  const handleSelect = (item: Person) => {
    selectPerson(item);
    setQuery(item.name);
  };

  const handleKeyPress = (event: React.KeyboardEvent, item: Person) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleSelect(item);
    }
  };

  const handleKeyPush = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const currentElement = (event.target as HTMLInputElement).value;

    if (event.key === 'Enter') {
      const currentPerson =
        people.find(item =>
          item.name.toLowerCase().includes(currentElement.toLowerCase()),
        ) !== undefined
          ? people.find(item =>
            item.name.toLowerCase().includes(currentElement.toLowerCase()),)
          : null;

      aplyQuery(currentPerson?.name || '');
      setQuery(currentPerson?.name || '');
      selectPerson(currentPerson || null);
    }
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsFocused(false);
    selectPerson(null);
    checFocus();
    applyQuery(event.target.value);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onFocus={handleFocused}
          onBlur={handleBlur}
          onChange={handleQueryChange}
          onKeyDown={event => {
            handleKeyPush(event);
          }}
        />
      </div>

      <div
        className={classNames('dropdown-menu', {
          'is-hidden':
            !isFocused || selectedPerson !== null || people.length === 0,
        })}
        role="menu"
        data-cy="suggestions-list"
      >
        <div
          className={classNames('dropdown-content', {
            'is-hidden': !isFocused,
          })}
        >
          {people.map((item, index) => {
            return (
              <div
                role="button"
                className={classNames('dropdown-item', {
                  selected: people.length === 1,
                })}
                data-cy="suggestion-item"
                key={item.slug}
                tabIndex={index}
                onKeyDown={(event: React.KeyboardEvent) => {
                  handleKeyPress(event, item);
                }}
                onClick={() => {
                  handleSelect(item);
                }}
                onFocus={handleFocused}
              >
                <p
                  className={classNames('text', {
                    'has-text-link': item.sex === 'm',
                    'has-text-danger': item.sex === 'f',
                  })}
                >
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
