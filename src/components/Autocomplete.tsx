import { useState, useMemo, useRef, useEffect } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

interface AutocompleteProps {
  data: Person[];
  delay?: number;
  onSelected?: (person: Person) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  data,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showField, setShowField] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setQuery(value);

    if (value.trim() !== '') {
      timeoutQuery(value);
    } else {
      setAppliedQuery('');
    }

    setSelectedPerson(null);
  };

  const peopleToShow = useMemo(() => {
    const trimmedQuery = appliedQuery.trim().toLowerCase();

    return data.filter(person =>
      person.name.toLowerCase().includes(trimmedQuery),
    );
  }, [appliedQuery, data]);

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setShowField(false);
    setQuery(person.name);

    if (onSelected) {
      onSelected(person);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowField(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef}>
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={query}
        onFocus={() => setShowField(true)}
        onChange={handleInput}
        data-cy="search-input"
      />

      {showField && (
        <div
          className={classNames('dropdown', {
            'is-active': peopleToShow.length > 0,
          })}
        >
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {peopleToShow.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  data-cy="suggestion-item"
                  onClick={() => handleSelectPerson(person)}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {appliedQuery && peopleToShow.length === 0 && (
        <div
          className="notification is-danger is-light mt-3"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}

      <h1 className="title" data-cy="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>
    </div>
  );
};
