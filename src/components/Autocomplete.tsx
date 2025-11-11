import React, { useEffect, useRef, useState } from 'react';
import type { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected?: (p: Person) => void;
  onInputChange?: (value: string) => void;
};

export default function Autocomplete({
  people,
  delay = 300,
  onSelected,
  onInputChange,
}: Props) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [open, setOpen] = useState(false);

  const timerRef = useRef<number | null>(null);
  const lastFilteredRef = useRef<string>('');
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      const cur = value;

      if (cur === lastFilteredRef.current) {
        return;
      }

      lastFilteredRef.current = cur;

      // изменено: проверяем на СТРОГО пустую строку
      if (value === '') {
        setSuggestions(people);
      } else {
        const trimmed = cur.trim().toLowerCase();

        // добавлено: если после trim() строка пустая, показываем пустой список
        if (trimmed === '') {
          setSuggestions([]);
        } else {
          setSuggestions(
            people.filter(p => p.name.toLowerCase().includes(trimmed)),
          );
        }
      }

      setOpen(true);
    }, delay);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, people, delay]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) {
        return;
      }

      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocClick);

    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleFocus = () => {
    // изменено: проверяем на СТРОГО пустую строку
    if (value === '') {
      setSuggestions(people);
    }

    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;

    setValue(v);
    onInputChange?.(v);
    setOpen(true);
  };

  const handleSelect = (p: Person) => {
    setValue(p.name);
    setSuggestions([]);
    setOpen(false);
    lastFilteredRef.current = p.name;
    onSelected?.(p);
  };

  return (
    <div
      ref={rootRef}
      className={`dropdown ${open ? 'is-active' : ''}`}
      style={{ width: '100%' }}
    >
      <div className="dropdown-trigger" style={{ width: '100%' }}>
        <input
          className="input"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Enter a part of the name"
          data-cy="search-input"
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
        style={{ width: '100%' }}
      >
        <div className="dropdown-content">
          {open &&
            suggestions.length > 0 &&
            suggestions.map(s => (
              <a
                key={`${s.name}-${s.born}`}
                href="#"
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={ev => {
                  ev.preventDefault();
                  handleSelect(s);
                }}
              >
                <p
                  className={
                    s.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                >
                  {s.name}
                </p>
              </a>
            ))}
          {open && suggestions.length === 0 && (
            <div className="dropdown-item" data-cy="no-suggestions-message">
              <p className="has-text-grey">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
