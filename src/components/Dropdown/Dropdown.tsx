import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Dropdown.scss';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

type Props = {
  delay?: number;
  onSelected: (person: Person | null) => void;
  people: Person[];
};

export const Dropdown: React.FC<Props> = ({
  delay = 300,
  onSelected,
  people,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [listOfPeople, setListOfPeople] = useState(people);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [
    setAppliedQuery,
    delay,
  ]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelected(null);

    if (event.target.value !== query) {
      setQuery(event.target.value);
      applyQuery(event.target.value.trim());
    }
  };

  const filteredPeople = useMemo(() => {
    return listOfPeople.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, listOfPeople]);

  return (
    <div className={classNames('dropdown', { 'is-active': isFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          ref={inputRef}
          placeholder="Enter a part of the name"
          value={query}
          className="input"
          data-cy="search-input"
          onChange={handleQueryChange}
          onClick={() => {
            // setQuery('');
            // onSelected(null);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {filteredPeople.length !== 0 ? (
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onMouseDown={() => {
                  onSelected(person);
                  setQuery(person.name);
                  setAppliedQuery('');
                  setListOfPeople(people);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
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
  );
};
