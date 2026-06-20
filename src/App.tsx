import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import cn from 'classnames';

interface Props {
  delay?: number;
  onSelected?: (person: Person | null) => void;
}

export const App: React.FC<Props> = ({ delay = 300, onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedInputValue, setDebouncedInputValue] = useState('');

  const filteredPeople = peopleFromServer.filter(person => {
    return person.name
      .toLowerCase()
      .includes(debouncedInputValue.toLowerCase());
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={cn('dropdown', {
            'is-active': isOpen && filteredPeople.length > 0,
          })}
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={event => {
                setInputValue(event.target.value);
                setSelectedPerson(null);

                if (onSelected) {
                  onSelected(null);
                }
              }}
              onFocus={() => {
                setIsOpen(true);
              }}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => {
                return (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={() => {
                      setInputValue(person.name);
                      setSelectedPerson(person);
                      setIsOpen(false);

                      if (onSelected) {
                        onSelected(person);
                      }
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && inputValue !== '' && (
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
      </main>
    </div>
  );
};
