import React, { useCallback, useState } from "react";
import { Person } from "../types/Person";
import classNames from "classnames";

type Props = {
  query: string;
  onQueryChange: React.Dispatch<React.SetStateAction<string>>;
  people: Person[];
  debounceDelay?: number;
  onSelected: (person: Person) => void;
};

type Callback = (value: string) => void;

function debounce(callback: Callback, delay: number) {
  let timerId = 0;
  let lastValue = '';

  return (value: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      if (lastValue === value) {
        return;
      }

      lastValue = value;
      callback(value);
    }, delay);
  };
}

export const Autocomplete: React.FC<Props> = ({
  query,
  people,
  debounceDelay = 300,
  onSelected,
  onQueryChange,
}) => {
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, debounceDelay), []);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeoples: Person[] =
    appliedQuery.trim() === '' && isFocused
      ? people
      : people.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
      );

  return (
    <div className={classNames('dropdown', { 'is-active': isFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleChangeQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeoples.length > 0 ? (
            filteredPeoples.map(person => (
              <div
                className={classNames('dropdown-item')}
                data-cy="suggestion-item"
                key={person.born}
                onMouseDown={() => {
                  onSelected(person);
                  onQueryChange(person.name);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))
          ) : (
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
        </div>
      </div>
    </div>
  );
};
