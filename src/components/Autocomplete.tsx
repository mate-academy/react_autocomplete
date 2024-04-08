import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounse(callback: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

type Props = {
  people: Person[];
  delay: number;
  onSelect: (n: string, b: number, d: number) => void;
};

export const Autocomplete: React.FC<Props> = ({ people, delay, onSelect }) => {
  const [searchPeople, setSearchPeople] = useState('');
  const [apliedPeople, setApliedPeople] = useState('');
  const [usePeople, setUsePeople] = useState(false);
  let name = '';

  const handleUsePeople = () => {
    setUsePeople(true);
  };

  const handleClickUser = (person: Person) => {
    setUsePeople(false);
    setSearchPeople(person.name);
    setApliedPeople(person.name);
    onSelect(person.name, person.born, person.died);
    name = person.name;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyPeople = useCallback(debounse(setApliedPeople, delay), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPeople(e.target.value);
    applyPeople(e.target.value);

    if (e.target.value !== name) {
      onSelect('', 0, 0);
    }
  };

  const peopleFilter = useMemo(() => {
    return people.filter(it =>
      it.name.toLowerCase().includes(apliedPeople.toLowerCase()),
    );
  }, [apliedPeople, people]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={searchPeople}
          onChange={handleSearchChange}
          onFocus={handleUsePeople}
        />
      </div>

      {usePeople && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {peopleFilter.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                onClick={() => {
                  handleClickUser(person);
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
            {!peopleFilter.length && (
              <div className="dropdown-item" data-cy="suggestion-item">
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
