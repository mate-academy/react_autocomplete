import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';
import { debounce } from '../../utils/debounce';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
  onReset: () => void;
  selectedPerson: Person | null;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelect,
  onReset,
  selectedPerson,
  delay = 300,
}) => {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [delayedQuery, setDelayedQuery] = useState<string>('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const setQueryDebounced = useCallback(debounce(setDelayedQuery, delay), [
    delay,
  ]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (selectedPerson && inputValue !== selectedPerson.name) {
      onReset();
    }

    setInputQuery(inputValue);
    setQueryDebounced(inputValue);
  };

  const handleReset = () => {
    setInputQuery('');
    setDelayedQuery('');
    onReset();
  };

  const filteredPeople = useMemo(() => {
    return [...people].filter(person => {
      const personName = person.name.toLowerCase();

      return personName.includes(delayedQuery.toLowerCase());
    });
  }, [delayedQuery, people]);

  const noMatching =
    !selectedPerson && !filteredPeople.length && delayedQuery.trim() !== '';

  const showDropdownOptions =
    !selectedPerson && showAutocomplete && filteredPeople.length > 0;

  return (
    <div className="dropdown is-active is-flex is-flex-direction-column">
      <div className="dropdown-trigger" style={{ width: '50%' }}>
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              onFocus={() => setShowAutocomplete(true)}
              onBlur={() => setShowAutocomplete(false)}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputQuery}
              onChange={handleQueryChange}
            />
          </div>

          <div className="control">
            <button className="button" onClick={handleReset}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {showDropdownOptions && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => {
              return (
                <a
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onClick={() => {
                    setInputQuery(person.name);
                    setDelayedQuery(person.name);
                    onSelect(person);
                  }}
                  onMouseDown={e => e.preventDefault()}
                >
                  <p
                    className={cn({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {noMatching && (
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
  );
};
