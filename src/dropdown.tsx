import React, { useMemo, useRef, useState, useCallback } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import './App.scss';

type Props = {
  delay?: number;
  onSelected: (person?: Person) => void;
  onInputChanged: () => void;
};

export const Dropdown: React.FC<Props> = ({ delay = 300, onSelected, onInputChanged }) => {
  const inputEl: React.MutableRefObject<HTMLInputElement | null> = useRef(null);
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  const people = useMemo(() => {
    if (!query.trim()) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(query),
    );
  }, [query]);

  const onSelect = (person: Person) => {
    const input = inputEl.current;

    if (!input) {
      return;
    }

    input.value = person.name;
    setQuery('');
    setIsActive(false);
    onSelected(person);
  };

  const applyQuery = useCallback((input: HTMLInputElement) => {
    setQuery((input?.value ?? '').toLowerCase());
  }, []);

  const debounced = debounce(applyQuery, delay);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounced(event.target);
    setIsActive(true);
    onInputChanged();
  };

  return (
    <>
      <div className={classNames({ dropdown: true, 'is-active': isActive })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            ref={inputEl}
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onChange={onInputChange}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          />
        </div>

        {people.length ? (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {people.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  role="button"
                  tabIndex={0}
                  onMouseDown={() => onSelect(person)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      onSelect(person);
                    }
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {!people.length && query.trim() !== '' && isActive ? (
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
          <p className="has-te xt-danger">No matching suggestions</p>
        </div>
      ) : null}
    </>
  );
};
