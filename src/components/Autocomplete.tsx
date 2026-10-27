import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const filteredPeople = useMemo(() => {
    const normalizedQuery = appliedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    const trimmedQuery = newQuery.trim();

    setQuery(newQuery);
    setIsOpen(true);

    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected(null);
    }

    if (!trimmedQuery) {
      applyQuery.cancel();
      setAppliedQuery('');

      return;
    }

    applyQuery(trimmedQuery);
  };

  const handlePersonSelect = (person: Person) => {
    applyQuery.cancel();
    setQuery(person.name);
    setAppliedQuery(person.name);
    setSelectedPerson(person);
    setIsOpen(false);
    onSelected(person);
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isOpen && filteredPeople.length > 0,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <a
                key={person.slug}
                href={`#${person.slug}`}
                className="dropdown-item"
                data-cy="suggestion-item"
                onMouseDown={event => event.preventDefault()}
                onClick={event => {
                  event.preventDefault();
                  handlePersonSelect(person);
                }}
              >
                <p
                  className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {appliedQuery.trim().length > 0 && filteredPeople.length === 0 && (
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
