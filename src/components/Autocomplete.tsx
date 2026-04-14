import React, { useMemo, useState } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

function debounce<T extends (...args: never[]) => void>(
  callback: T,
  delay: number,
) {
  let timerId = 0;

  return (...args: Parameters<T>) => {
    clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const trimAppliedQuery = appliedQuery.trim().toLocaleLowerCase();

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const normalizedNewValue = newValue.trim().toLowerCase();

    setInputValue(newValue);
    onSelected(null);

    if (normalizedNewValue === trimAppliedQuery) {
      return;
    }

    applyQuery(newValue);
  };

  const filterPeople = useMemo(() => {

    return people.filter(person => {
      return person.name.trim().toLocaleLowerCase().includes(trimAppliedQuery);
    });
  }, [trimAppliedQuery, people]);

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputValue}
            onFocus={() => setIsOpenMenu(true)}
            data-cy="search-input"
            onChange={handleQueryChange}
            onBlur={() => {
              setIsOpenMenu(false);
            }}
          />
        </div>
        {isOpenMenu && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {filterPeople.length !== 0 && (
              <div className="dropdown-content">
                {filterPeople.map(person => {
                  return (
                    <div
                      className="dropdown-item is-clickable"
                      data-cy="suggestion-item"
                      key={person.slug}
                      onMouseDown={() => {
                        onSelected(person);
                        setInputValue(person.name);
                        setIsOpenMenu(false);
                      }}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      {isOpenMenu && filterPeople.length === 0 && (
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
