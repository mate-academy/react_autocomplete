import React, { useCallback, useState, useMemo } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelect: (person: Person | null) => void;
  delay?: number;
}

const filterPeople = (arr: Person[], searchTerm: string) => {
  if (searchTerm.trim()) {
    return arr.filter(({ name }) => (
      name.toLowerCase().includes(searchTerm.trim().toLowerCase())));
  }

  return [];
};

export const debounce = (callback: CallableFunction, delay: number) => {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelect,
  delay = 1000,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [toCloseMenu, setToCloseMenu] = useState(false);

  const applySearchTerm = useCallback(
    debounce(setAppliedSearchTerm, delay),
    [],
  );

  const filteredPeople = useMemo(() => (
    filterPeople(people as Person[], appliedSearchTerm)),
  [appliedSearchTerm]);

  const toShowError = appliedSearchTerm !== ''
    && filteredPeople.length === 0
    && appliedSearchTerm === searchTerm;

  const toShowMenu = appliedSearchTerm !== ''
    && filteredPeople.length > 0
    && appliedSearchTerm === searchTerm
    && !toCloseMenu;

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            applySearchTerm(event.target.value);

            setToCloseMenu(false);
          }}
        />
      </div>

      {toShowError && (
        <h2 className="dropdown-menu">
          No matching suggestions
        </h2>
      )}

      {toShowMenu && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <a
                href="/#"
                className="dropdown-item"
                key={person.name}
                onClick={(event) => {
                  event.preventDefault();

                  setSearchTerm(person.name);
                  setAppliedSearchTerm(person.name);

                  setToCloseMenu(true);

                  onSelect(person);
                }}
              >
                <p className={person.sex === 'm'
                  ? 'has-text-link'
                  : 'has-text-danger'}
                >
                  {person.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
