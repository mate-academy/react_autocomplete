import debounce from 'lodash.debounce';
import React, { useCallback } from 'react';

interface Props {
  query: string;
  setQuery: (query: string) => void;
  setAppliedQuery: (query: string) => void;
  delay: number;
  setIsListShown: (argument: boolean) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
}

export const PeopleInput: React.FC<Props> = ({
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
        onChange={handleQueryChange}
        onFocus={() => setIsListShown(true)}
        onBlur={onBlur}
      />
    </div>
  );
};
