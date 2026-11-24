import React, { useState, useEffect } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  onSelected,
  delay = 300,
}: Props) => {
  const [personName, setPersonName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [hasFiltered, setHasFiltered] = useState(false);

  const handleClick = (person: Person) => {
    setPersonName(person.name);
    setIsActive(false);
    onSelected(person);
  };

  useEffect(() => {
    if (!personName.trim()) {
      setFilteredPeople(peopleFromServer);
      setHasFiltered(true);

      return;
    }

    const timer = setTimeout(() => {
      setFilteredPeople(
        peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(personName.toLowerCase()),
        ),
      );
      setHasFiltered(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [personName, delay]);

  return (
    <>
      <div className={'dropdown' + (isActive === true ? ' is-active' : '')}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            data-qa="search-input"
            value={personName}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            onChange={event => {
              setPersonName(event.target.value);
              onSelected(null);
            }}
          />
        </div>

        <div
        className="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
        data-qa="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(suggestion => {
              return (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  data-qa="suggestion-item"
                  key={suggestion.slug}
                  onMouseDown={() => handleClick(suggestion)}
                >
                  <p className="has-text-link">{suggestion.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {hasFiltered && filteredPeople.length === 0 && (
        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
          data-qa="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
