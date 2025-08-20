import React, { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

type Props = {
  items: Person[];
  delay?: number;
  onChange: (query: string, filtered: Person[], focused: boolean) => void;
  query?: string;
};

export const Autocomplete: React.FC<Props> = ({
  items,
  delay = 300,
  onChange,
  query = '',
}) => {
  const [focused, setFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState(query);

  const debouncedApplyQuery = useMemo(
    () => debounce((value: string) => setAppliedQuery(value), delay),
    [delay],
  );

  const filtered = useMemo(() => {
    const normalized = appliedQuery.trim().toLowerCase();

    if (normalized === '') {
      return items;
    }

    return items.filter(person =>
      person.name.toLowerCase().includes(normalized),
    );
  }, [appliedQuery, items]);

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;

    debouncedApplyQuery(value);

    onChange(value, filtered, focused);
  }

  function handleFocus(): void {
    setFocused(true);
    onChange(query, filtered, true);
  }

  function handleBlur(): void {
    setFocused(false);
    onChange(query, filtered, false);
  }

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        className="input"
        placeholder="Enter a part of the name"
        data-cy="search-input"
        value={query}
        onChange={handleQueryChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};
