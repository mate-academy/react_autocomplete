import React, { useCallback } from 'react';
import debounce from 'lodash.debounce';

type Props = {
  query: string;
  setQuery: (value: string) => void;
  setAppliedQuery: (value: string) => void;
  setIsFocused: (value: boolean) => void;
  delay: number;
};

export const Input: React.FC<Props> = ({
  query,
  setQuery,
  setAppliedQuery,
  setIsFocused,
  delay,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (

    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={query}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        onChange={handleQueryChange}
      />
    </div>
  );
};
