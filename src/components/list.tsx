import React, { useMemo, useRef } from 'react';
import { Person } from '../types/Person';
// import { peopleFromServer } from "../data/people"; // якщо не використовуєш тут, можна видалити

type ListProps = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

const List: React.FC<ListProps> = ({ people, onSelected, delay = 300 }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [normalizedQuery, setNormalizedQuery] = React.useState('');
  const timerid = useRef(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setQuery(inputValue); // В інпуті показуємо все як є (навіть пробіли)
    setIsOpen(true);
    onSelected(null);

    window.clearTimeout(timerid.current);

    const newNormalized = inputValue.trim().toLowerCase();

    if (newNormalized === normalizedQuery) {
      return;
    }

    if (newNormalized) {
      timerid.current = window.setTimeout(() => {
        setNormalizedQuery(newNormalized);
      }, delay);
    } else {
      setNormalizedQuery('');
    }
  };

  const filteredPeople = useMemo(() => {
    if (!normalizedQuery) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, normalizedQuery]);

  const handleSelectPerson = (person: Person) => {
    setQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  return (
    <div className="container">
      <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelectPerson(person)}
                style={{ cursor: 'pointer' }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpen && normalizedQuery !== '' && filteredPeople.length === 0 && (
        <div
          className={`
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          `}
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
};

export default List;
