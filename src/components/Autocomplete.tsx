import { useEffect, useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

type Props = {
  people: Person[];
  delay: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null);
    setIsOpen(true);
  };

  const handleInputSelect = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsOpen(false);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      const trimmedQuery = query.trim();

      if (trimmedQuery === '') {
        return setSuggestions(people);
      }

      const normalized = trimmedQuery.toLowerCase();
      const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(normalized),
      );

      setSuggestions(filteredPeople);
    }, delay);

    return () => clearTimeout(timerId);
  }, [delay, people, query]);

  return (
    <>
      <div className={classNames('dropdown', { 'is-active': isOpen })}>
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
            {suggestions.map(suggest => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={suggest.slug}
                onClick={() => handleInputSelect(suggest)}
              >
                <p
                  className={classNames('has-text-link', {
                    'has-text-danger': suggest.sex === 'f',
                  })}
                >
                  {suggest.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {suggestions.length === 0 && query && isOpen && (
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
