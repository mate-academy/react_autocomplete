import { useEffect, useRef, useState } from 'react';
import { Person } from '../types/Person';
import cn from 'classnames';

type Props = {
  persons: Person[];
  onSelected: (per: Person | null) => void;
  delay?: number;
};

function filterPerson(arrPers: Person[], query: string) {
  return arrPers.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );
}

export const Autocomplete = ({ persons, onSelected, delay }: Props) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [normalaizeQuery, setNormalaizeQuery] = useState('');

  const timeRef = useRef<number | null>(null);
  const prevNormQuery = useRef<string>('');

  const arrPers = filterPerson(persons, normalaizeQuery);

  const handlerSelectPerson = (person: Person) => {
    const name = person.name;
    const normName = person.name.trim().toLowerCase();

    if (timeRef.current) {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }

    setQuery(name);
    setNormalaizeQuery(normName);
    prevNormQuery.current = normName;
    setIsOpen(false);
    onSelected(person);
  };

  const hadlerFocusInput = () => {
    if (query.trim() === '') {
      setNormalaizeQuery('');
      setIsOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  const hadlerQueryCgange = (newValue: string) => {
    const normValue = newValue.trim().toLowerCase();

    if (timeRef.current) {
      window.clearTimeout(timeRef.current);
    }

    if (normValue === '') {
      setNormalaizeQuery('');
      prevNormQuery.current = '';
      setQuery(newValue);
      setIsOpen(true);

      return;
    }

    setQuery(newValue);
    onSelected(null);

    timeRef.current = window.setTimeout(() => {
      if (normValue === prevNormQuery.current) {
        return;
      } else {
        prevNormQuery.current = normValue;
        setNormalaizeQuery(normValue);
      }
    }, delay || 300);
  };

  useEffect(() => {
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className={cn('dropdown', { 'is-active': isOpen })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-qa="search-input"
            value={query}
            onChange={e => hadlerQueryCgange(e.target.value)}
            onFocus={hadlerFocusInput}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {arrPers.map(person => (
              <div
                className="dropdown-item"
                data-qa="suggestion-item"
                key={person.name}
                onClick={() => handlerSelectPerson(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}

            {isOpen && arrPers.length === 0 && (
              <div
                className="
                    notification
                    is-danger
                    is-light
                    mt-3
                    is-align-self-flex-start
                    "
                role="alert"
                data-qa="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
