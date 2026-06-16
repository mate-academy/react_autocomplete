import { useMemo, useRef, useState } from 'react';
import cn from 'clsx';
import { useDebounce } from '../services/helpers';

type Option = {
  name: string;
  slug: string;
};

type Props<T extends Option> = {
  options: T[];
  onSelected: (value: T | null) => void;
  delay?: number;
};

export function Autocomplete<T extends Option>({
  options,
  onSelected,
  delay = 300,
}: Props<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, delay);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const prevDebouncedQueryRef = useRef<string | null>(null);
  const prevFilteredRef = useRef<T[]>(options);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (selectedOption) {
      setSelectedOption(null);
      onSelected(null);
    }

    setQuery(value);
    setIsOpen(true);
  };

  const filteredOptions = useMemo(() => {
    if (prevDebouncedQueryRef.current === debouncedQuery) {
      return prevFilteredRef.current;
    }

    prevDebouncedQueryRef.current = debouncedQuery;

    const queryStr = debouncedQuery.trim().toLowerCase();

    if (!queryStr) {
      prevFilteredRef.current = options;

      return options;
    }

    const result = options.filter(opt =>
      opt.name.toLowerCase().includes(queryStr),
    );

    prevFilteredRef.current = result;

    return result;
  }, [options, debouncedQuery]);

  const handleSelect = (option: T) => {
    setSelectedOption(option);
    setQuery(option.name);
    setIsOpen(false);
    onSelected(option);
  };

  return (
    <>
      <div className={cn('dropdown', { 'is-active': isOpen })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onChange={handleInputChange}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredOptions.map(option => (
              <div
                className={cn('dropdown-item', {
                  'is-active': selectedOption?.slug === option.slug,
                })}
                data-cy="suggestion-item"
                key={option.slug}
                onMouseDown={event => {
                  event.preventDefault();
                  handleSelect(option);
                }}
              >
                <p className="has-text-link">{option.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpen && query.trim() && filteredOptions.length === 0 && (
        <div
          // eslint-disable-next-line max-len
          className="notification is-danger is-light mt-3 is-align-self-flex-start"
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
}
