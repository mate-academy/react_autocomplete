import { useMemo, useRef, useState } from 'react';
import { Person } from '../../types/Person';
import cn from 'classnames';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const timerId = useRef(0);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);

    onSelected(null);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setAppliedQuery(newQuery.trim().toLowerCase());
    }, delay);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    setIsOpen(false);
  };

  const handlePersonSelect = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
    setIsOpen(false);
  };

  const visiblePeople = useMemo(() => {
    if (appliedQuery.length === 0) {
      return people;
    }

    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery),
    );
  }, [appliedQuery, people]);

  return (
    <>
      <div
        className={cn('dropdown', {
          'is-active': isOpen && visiblePeople.length > 0,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visiblePeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item is-clickable"
                data-cy="suggestion-item"
                onMouseDown={() => handlePersonSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {visiblePeople.length === 0 && appliedQuery.length > 0 && (
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
