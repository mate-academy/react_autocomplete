import React, { ChangeEvent, useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import { PeopleList } from '../PeopleList/PeopleList';

interface Props {
  items: Person[];
  debounceTimeout: number;
  onSelect: (selectedPerson: Person) => void;
  onReset: () => void;
}

export const Autocomplete: React.FC<Props> = ({
  items,
  debounceTimeout,
  onSelect,
  onReset,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const applyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value), debounceTimeout),
    [],
  );

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setAppliedQuery(event.target.value);
  };

  const filteredPeople = items.filter((person) => person.name.toLowerCase().includes(appliedQuery.toLowerCase())); // eslint-disable-line

  const dropdownActive = query !== '' || isInputFocused;

  const onBlurTimeout = () => {
    if (!isInputFocused) {
      setIsInputFocused(false);
    }
  };

  const reset = () => {
    setQuery('');
    applyQuery('');
    setAppliedQuery('');
    setIsInputFocused(false);
    onReset();
  };

  return (
    <div className={`dropdown ${dropdownActive ? 'is-active' : ''}`}>
      <div className="dropdown-trigger control has-icons-right">
        <input
          onFocus={() => {
            setIsInputFocused(true);
          }}
          onBlur={onBlurTimeout}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
        />

        {query !== '' && (
          <span className="icon is-small is-right">
            <button
              onClick={reset}
              type="button"
              className="delete is-small"
            >
              x
            </button>
          </span>
        )}
      </div>

      <PeopleList
        people={filteredPeople}
        onSelectPerson={onSelect}
        updateInputValue={setQuery}
      />

      {appliedQuery !== '' && filteredPeople.length === 0 && (
        <div
          className="
            notification
            is-danger
            is-light
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};
