import cn from 'classnames';
import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person) => void;
  onChange: () => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = React.memo(function Autocomplete({
  people,
  onSelect,
  onChange,
  delay = 300,
}) {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  const applyQuery = useCallback(
    () => debounce((value: string) => setAppliedQuery(value), delay),
    [delay],
  );

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
      onChange();
      setIsOpen(true);
      setHighlightIndex(-1);
    },
    [applyQuery, onChange],
  );

  const suggestions = useMemo(() => {
    if (!appliedQuery.trim()) {
      return people;
    }

    return people.filter(p =>
      p.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people]);

  const handleSelect = useCallback(
    (person: Person) => {
      setQuery(person.name);
      setAppliedQuery(person.name);
      setIsOpen(false);
      onSelect(person);
    },
    [onSelect],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      setHighlightIndex(prev => (prev + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      setHighlightIndex(prev =>
        prev <= 0 ? suggestions.length - 1 : prev - 1,
      );
    } else if (event.key === 'Enter' && highlightIndex >= 0) {
      handleSelect(suggestions[highlightIndex]);
    }
  };

  return (
    <div className={cn('dropdown', { 'is-active': isOpen })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls="suggestions-list"
        />
      </div>

      {isOpen && (
        <div
          id="suggestions-list"
          className="dropdown-menu"
          role="listbox"
          data-cy="suggestions-list"
        >
          <div className="dropdown-content">
            {suggestions.map((person, index) => (
              <div
                key={`${person.slug}-${index}`}
                role="option"
                aria-selected={highlightIndex === index}
                className={cn('dropdown-item', {
                  'is-active': highlightIndex === index,
                })}
                onClick={() => handleSelect(person)}
                data-cy="suggestion-item"
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestions.length === 0 && query.trim() !== '' && (
        <div
          className="notification is-danger is-light mt-3"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </div>
  );
});
