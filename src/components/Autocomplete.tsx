import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({ people, delay = 300, onSelected }) => {
    const [inputValue, setInputValue] = useState('');
    const [appliedInputValue, setAppliedInputValue] = useState('');
    const [showNoResults, setShowNoResults] = useState(false);
    const timerId = useRef<number>(0);

    const handleInputValueChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const newValue = event.target.value;

      setInputValue(newValue);

      // Очищуємо вибір при зміні тексту
      onSelected(null);

      window.clearTimeout(timerId.current);

      timerId.current = window.setTimeout(() => {
        setAppliedInputValue(newValue.trim().toLowerCase());
      }, delay);
    };

    const filteredPeople: Person[] = useMemo(() => {
      if (!appliedInputValue) {
        return people;
      }

      return people.filter(person =>
        person.name.toLowerCase().includes(appliedInputValue),
      );
    }, [appliedInputValue, people]);

    // Окремий useEffect для перевірки результатів
    useEffect(() => {
      if (appliedInputValue && filteredPeople.length === 0) {
        setShowNoResults(true);
      } else {
        setShowNoResults(false);
      }
    }, [appliedInputValue, filteredPeople.length]);

    const handlePersonSelect = (person: Person) => {
      setInputValue(person.name);
      onSelected(person);
    };

    return (
      <>
        <div className={`dropdown ${filteredPeople.length > 0 && 'is-active'}`}>
          <div className="dropdown-trigger">
            <input
              autoFocus
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={handleInputValueChange}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map((person, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handlePersonSelect(person)}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showNoResults && (
          <div
            className="
              notification is-danger is-light mt-3 is-align-self-flex-start
            "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </>
    );
  },
);
Autocomplete.displayName = 'Autocomplete';
