import React, { useCallback, useState } from 'react';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

interface Props {
  onSelected: (person: Person) => void;
  delay: number;
}

const debounce = <T extends unknown[]>(f: (...args: T) =>
void, delay: number) => {
  let timerId: ReturnType<typeof setTimeout>;

  return (...args: T): void => {
    clearTimeout(timerId);
    timerId = setTimeout(f, delay, ...args);
  };
};

export const AutoComplited: React.FC<Props> = ({
  onSelected,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const handlePersonSelection = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
  };

  const filterPeople = peopleFromServer
    .filter(person => person.name
      .toLowerCase().includes(appliedQuery.toLowerCase()));

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleValueChange}
          onClick={toggle}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {isOpen && (
            filterPeople.length > 0 ? (
              filterPeople.map((person) => (
                <div
                  key={person.id}
                  className="dropdown-item"
                >
                  <button
                    type="button"
                    onClick={() => {
                      handlePersonSelection(person);
                      toggle();
                    }}
                    className="button-reset has-text-link"
                  >
                    {person.name}
                  </button>
                </div>
              ))
            ) : (
              <div className="dropdown-item">No matching suggestions</div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
