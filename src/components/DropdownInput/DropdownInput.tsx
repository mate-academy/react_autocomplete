import React, { useCallback } from 'react';
import debounce from 'lodash.debounce';

interface Props {
  query: string;
  setQuery: (query: string) => void
  setAppliedQuery: (query: string) => void;
  delay: number;
  setIsListShown: (arg: boolean) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
}

export const DropdownInput: React.FC<Props> = ({
  query,
  setQuery,
  setAppliedQuery,
  delay,
  setIsListShown,
  onBlur,
}) => {
  // eslint-disable-next-line
  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={query}
        onChange={handleQueryChange}
        onFocus={() => setIsListShown(true)}
        onBlur={onBlur}
      />
    </div>
  );
};
