import { useEffect, useRef, useState } from 'react';
import { Person } from './types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const Autocomplete = ({
  people,
  onSelected,
  delay = 300,
}: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);
  const prevValue = useRef(inputValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue === prevValue.current) {
        return;
      }

      const filtered = people.filter(person =>
        person.name.includes(inputValue),
      );

      setFilteredPeople(filtered);
      prevValue.current = inputValue;
    }, delay);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <>
      <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value);
              onSelected(null);
            }}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => {
                  setInputValue(person.name);
                  setIsOpen(false);
                  onSelected(person);
                }}
              >
                {person.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      {filteredPeople.length === 0 && isOpen && (
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
