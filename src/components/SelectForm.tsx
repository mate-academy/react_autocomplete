import React, { useEffect, useMemo, useState, useRef } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';
import { PersonInfo } from './PersonInfo';

type Props = {
  peoples: Person[];
  onSelect: (selectPerson: Person | null) => void;
  delay?: number;
  currentPerson: Person | null;
};

export const SelectForm: React.FC<Props> = ({
  peoples,
  onSelect,
  currentPerson,
  delay = 300,
}) => {
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [query, setQuery] = useState<string>('');
  const [deboucedQuery, setDeboucedQuery] = useState('');

  const [isActiveFocus, setIsActiveFocus] = useState(false);

  useEffect(() => {
    // wenn input ist leer -> personList ohne pause kommt
    const trimed = query.trim();
    if (!trimed) {
      setDeboucedQuery('');
      onSelect(null);

      return;
    }

    const timeoutId = setTimeout(() => {
      setDeboucedQuery(trimed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, delay, onSelect]);

  const filteredPeople = useMemo<Person[]>(() => {
    const newFilteredList = peoples.filter(person => {
      return person.name.toLowerCase().includes(deboucedQuery.toLowerCase());
    });

    return newFilteredList;
  }, [deboucedQuery, peoples]);

  const handelPerson = (person: Person) => {
    onSelect(person);
    setQuery(person.name);

    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current)
    }

    setIsActiveFocus(false);
  };

  return (
    <div className={cn('dropdown', { 'is-active': isActiveFocus })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          className="input"
          data-cy="search-input"
          onChange={e => {
            setQuery(e.target.value);
            if (currentPerson === null) {
              return;
            }

            onSelect(null);
          }}
          onFocus={() => {
            if (blurTimeoutRef.current) {
              clearTimeout(blurTimeoutRef.current);
            }

            setIsActiveFocus(true);
          }}
          onBlur={() => {
            blurTimeoutRef.current = setTimeout(() => {
              setIsActiveFocus(false);
            }, delay + 100);
          }}
          placeholder="Enter a part of the name"
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredPeople.length === 0 ? (
            <div // notification
              className="
                notification
                is-danger
                is-light
                mt-3
                is-align-self-flex-start"
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          ) : (
            // rendering
            filteredPeople.map(person => (
              <PersonInfo
                person={person}
                key={person.name}
                onClick={handelPerson}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
