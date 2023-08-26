import { useCallback } from 'react';

import debounce from 'lodash.debounce';

interface Props {
  query: string;
  setFocused: React.Dispatch<React.SetStateAction<boolean>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setFilterQuery: React.Dispatch<React.SetStateAction<string>>;
  delay?: number;
}

export const QueryInput: React.FC<Props> = ({
  query,
  setFocused,
  setQuery,
  setFilterQuery,
  delay = 1000,
}) => {
  const applyQuery = useCallback(
    debounce(setFilterQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Enter a part of the name"
      className="input"
      value={query}
      onChange={handleQueryChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setTimeout(() => setFocused(false), 100)}
    />
  );
};
