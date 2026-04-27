import React, { useCallback, useEffect, useState } from 'react';
import { Person } from '../types/Person';
import './Autocomplete.scss';

type Props = {
  peopleFromServer: Person[];
  onNewSelected: (person: Person) => void;
  setNewValue: (value: string) => void;
  newValue: string;
  delay: number;
};

function debounce(callback: unknown, delay: number) {
  let timerId: unknown = 0;

  return function (...arg: unknown[]) {
    if (typeof timerId === 'number') {
      clearTimeout(timerId);
    }

    if (typeof callback === 'function') {
      timerId = setTimeout(() => callback(...arg), delay);
    }
  };
}

export const Autocomplete: React.FC<Props> = ({
  peopleFromServer,
  onNewSelected,
  setNewValue,
  newValue,
  delay,
}) => {
  const [people, setPeople] = useState(peopleFromServer);
  const [showList, setShowList] = useState(false);

  const setFilterPeople = useCallback(debounce(setPeople, delay), [delay]);

  useEffect(() => {
    const newArrayPeople = peopleFromServer.filter(person => {
      if (person.name.toLowerCase().includes(newValue.toLowerCase())) {
        return true;
      }

      return false;
    });

    setFilterPeople(newArrayPeople);
  }, [newValue]);

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onFocus={() => setShowList(true)}
            onBlur={() => setTimeout(() => setShowList(false), 300)}
            value={newValue}
            onChange={e => {
              if (newValue.trim() === '') {
                return;
              }

              setNewValue(e.target.value);
            }}
          />
        </div>

        {showList && people.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {people.map(person => {
                return (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={() => {
                      onNewSelected(person);
                      setNewValue(person.name);
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {people.length === 0 && showList ? (
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
      ) : (
        ''
      )}
    </>
  );
};
