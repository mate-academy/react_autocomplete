import cn from 'classnames';
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { Person } from '../types/Person';

type StringHook = (value: string) => void;

type Props = {
  people: Person[];
  query: string;
  onChange: StringHook;
  onQueryChange: StringHook;
  onSelect: (person: Person) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  query,
  onChange,
  onQueryChange,
  onSelect,
  delay = 300,
}) => {
  const dropdownRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setInputFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const debounce = useCallback((callback: StringHook, delayTime: number) => {
    let timerId = 0;

    return (arg: string) => {
      setIsSearching(true);
      window.clearTimeout(timerId);

      timerId = window.setTimeout(() => {
        callback(arg);
        setIsSearching(false);
      }, delayTime);
    };
  }, []);

  const applyQuery = debounce(onQueryChange, delay);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonSelect = (person: Person) => {
    onSelect(person);
    onChange(person.name);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current
        && !dropdownRef.current.contains(e.target as HTMLElement)
      ) {
        setInputFocused(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
  }, []);

  return (
    <div
      className={cn('dropdown', {
        'is-active': people.length !== 0 && isInputFocused && !isSearching,
      })}
      ref={dropdownRef}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setInputFocused(true)}
          className="input"
          data-cy="search-input"
        />
      </div>
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map((person) => (
            <a
              key={person.slug}
              href="./"
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={(event) => {
                event.preventDefault();
                setInputFocused(false);
                handlePersonSelect(person);
              }}
            >
              <p
                className={cn(
                  { 'has-text-link': person.sex === 'm' },
                  { 'has-text-danger': person.sex === 'f' },
                )}
              >
                {person.name}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
