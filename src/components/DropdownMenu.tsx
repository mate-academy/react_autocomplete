import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

const AutocompleteMenu: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setApliedQuery] = useState('');
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const timerId = useRef(0);
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setApliedQuery(event.target.value);
    }, delay);
  };

  const filteredPeople = useMemo(() => {
    if (appliedQuery.trim().length > 0) {
      return people.filter(ppl =>
        ppl.name
          .toLowerCase()
          .trim()
          .includes(appliedQuery.toLowerCase().trim()),
      );
    }

    return people;
  }, [appliedQuery, people]);

  return (
    <div
      className={classNames('dropdown', {
        'dropdown is-active': menuIsOpen,
      })}
    >
      <div className="dropdown-trigger">
        <input
          ref={inputField}
          value={query}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onChange={handleQueryChange}
          onFocus={() => setMenuIsOpen(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.map(ppl => (
            <div
              className="dropdown-item"
              key={ppl.slug}
              style={{ cursor: 'pointer' }}
              data-cy="suggestion-item"
              onClick={() => {
                onSelected(ppl);
                setQuery(ppl.name);
                setMenuIsOpen(false);
              }}
            >
              <p className="has-text-link">{ppl.name}</p>
            </div>
          ))}
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
      </div>
    </div>
  );
};

export const Autocomplete = React.memo(AutocompleteMenu);
