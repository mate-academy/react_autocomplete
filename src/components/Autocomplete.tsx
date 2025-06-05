import React, { useMemo, useState, useEffect } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  people: Person[];
  onSelected: (person: Person | undefined) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useMemo(
    () =>
      debounce((value: string) => {
        setAppliedQuery(value);
      }, delay),
    [delay],
  );

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  const filteredPeople =
    appliedQuery === ''
      ? people
      : people.filter(person =>
          person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
        );

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputValue}
            onClick={() => setIsOpen(true)}
            onChange={e => {
              setInputValue(e.target.value);
              applyQuery(e.target.value);
              onSelected(undefined);
            }}
            onBlur={() => setIsOpen(false)}
          />
        </div>

        {isOpen && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onMouseDown={() => {
                    onSelected(person);
                    setInputValue(person.name);
                  }}
                >
                  <p
                    className={
                      person.sex === 'f' ? 'has-text-danger' : 'has-text-link'
                    }
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {filteredPeople.length === 0 && (
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
