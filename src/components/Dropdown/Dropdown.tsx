import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import './Dropdown.scss';
import { clsx } from 'clsx';

interface Props {
  people: Person[];
  onSelected: (value: Person | null) => void;
  delay?: number;
}

export const Dropdown = ({ people, onSelected, delay = 300 }: Props) => {
  const [inputText, setInputText] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [isPersonSelected, setIsPersonSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPersonSelected(false);
    onSelected(null);
    setInputText(event.target.value);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setFilterQuery(inputText);
    }, delay);

    return () => clearTimeout(timerId);
  }, [inputText]);

  const filteredPeople = useMemo(() => {
    const normalizedQuery = filterQuery.toLowerCase().trim();

    if (!normalizedQuery) {
      return people;
    }

    return people.filter(person => {
      return person.name.toLowerCase().includes(normalizedQuery);
    });
  }, [filterQuery, people]);

  const hasNoSuggests = filteredPeople.length === 0;
  const isTyping = inputText !== filterQuery;

  const handlePersonSelect = (person: Person) => {
    setInputText(person.name);
    setFilterQuery(person.name);
    setIsPersonSelected(true);
    onSelected(person);
  };

  return (
    <>
      <div
        className={clsx('dropdown', {
          'is-active':
            isOpen && !hasNoSuggests && !isPersonSelected && !isTyping,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputText}
            onChange={handleTextChange}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
          />
        </div>

        <div
          className="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
          onMouseDown={event => event.preventDefault()}
        >
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handlePersonSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {hasNoSuggests && !isPersonSelected && !isTyping && (
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
