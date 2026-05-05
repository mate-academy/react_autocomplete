import React, { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  debounceMs?: number;
  onSelected?: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  debounceMs = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);

  // Keep last queried string to avoid re-filtering when identical
  const lastQueryRef = useRef<string | null>(null);
  // Track whether the last action was a selection (so we can avoid clearing it immediately)
  const selectedNameRef = useRef<string | null>(null);

  // Filtering function
  const doFilter = useCallback(
    (query: string) => {
      const q = query.trim().toLowerCase();

      if (lastQueryRef.current === q) {
        return; // don't run again if query hasn't changed
      }

      lastQueryRef.current = q;

      if (q === '') {
        setSuggestions(people);

        return;
      }

      const filtered = people.filter(p => p.name.toLowerCase().includes(q));

      setSuggestions(filtered);
    },
    [people],
  );

  // Debounced version
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilter = useCallback(
    debounce((q: string) => doFilter(q), debounceMs),
    [doFilter, debounceMs],
  );

  useEffect(() => {
    return () => {
      debouncedFilter.cancel();
    };
  }, [debouncedFilter]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;

    setInputValue(v);

    // if there was a selected person and the user changed the input, clear selection
    if (selectedNameRef.current && v !== selectedNameRef.current) {
      selectedNameRef.current = null;
      onSelected?.(null);
    }

    // open dropdown for new input
    setIsOpen(true);

    // Trigger debounce filtering
    debouncedFilter(v);
  };

  const onFocus = () => {
    // when focused and empty show all
    setIsOpen(true);
    if (inputValue.trim() === '') {
      // show all immediately
      lastQueryRef.current = '';
      setSuggestions(people);
    } else {
      debouncedFilter(inputValue);
    }
  };

  const onSuggestionClick = (p: Person) => {
    setInputValue(p.name);
    setIsOpen(false);
    selectedNameRef.current = p.name;
    lastQueryRef.current = p.name.trim().toLowerCase();
    setSuggestions([]);
    onSelected?.(p);
  };

  const onBlur = () => {
    // Delay closing to allow click event on suggestion to fire
    requestAnimationFrame(() => {
      setIsOpen(false);
    });
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(p => (
                <div
                  key={p.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={ev => ev.preventDefault()}
                  onClick={() => onSuggestionClick(p)}
                >
                  <p className="has-text-link">{p.name}</p>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <div
                  className="notification is-danger is-light"
                  role="alert"
                  data-cy="no-suggestions-message"
                >
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
