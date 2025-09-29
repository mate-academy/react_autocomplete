import { useEffect, useMemo, useRef, useState } from 'react';
import { Person } from './types/Person';
import * as React from 'react';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (p: Person | null) => void;
  selected?: Person | null;
};

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
  selected,
}) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (selected && input.trim() !== selected.name) {
      onSelected(null);
    }
  }, [input, selected, onSelected]);

  const debounced = useDebounced(input, delay);

  const lastResultsRef = useRef<{
    key: string;
    results: Person[];
  } | null>(null);

  const list = useMemo(() => {
    const normalized = debounced.trim().toLowerCase();

    if (normalized === '') {
      lastResultsRef.current = { key: normalized, results: people };
      return people;
    }

    if (lastResultsRef.current?.key === normalized) {
      return lastResultsRef.current.results;
    }

    const results = people.filter(p =>
      p.name.toLowerCase().includes(normalized),
    );

    lastResultsRef.current = { key: normalized, results };
    return results;
  }, [debounced, people]);

  const nothingFound = open && list.length === 0;

  const handleSelected = (person: Person) => {
    setInput(person.name);
    setOpen(false);
    onSelected(person);
  };

  return (
    <div className={`dropdown ${open ? 'is-active' : ''}`}>
      <div className="dropdown-trigger" style={{ width: '100%' }}>
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          data-cy="search-input"
          data-qa="search-input"
        />
      </div>

      {open && (
        <div
          className="dropdown-menu"
          role="menu"
          data-cy="suggestions-list"
          data-qa="suggestions-list"
        >
          <div className="dropdown-content">
            {nothingFound && (
              <div
                className="dropdown-item"
                data-cy="no-suggestions-message"
                data-qa="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}

            {list.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                data-qa="suggestion-item"
                onMouseDown={e => e.preventDefault()}
                onClick={() => handleSelected(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
