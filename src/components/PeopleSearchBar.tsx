import React, { useCallback } from 'react';

type Props = {
  onType: (str: string) => void;
  delay: number;
  setAppliedQuery: (str: string) => void;
  query: string;
  onFocus: () => void;
  onBlur: () => void;
};

type DebouncedFunction = (...args: string[]) => void;

const debounce = (callback: DebouncedFunction, delay: number) => {
  let timerId = 0;

  return (...args: string[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const PeopleSearchBar: React.FC<Props> = ({
  query,
  onType = () => {},
  delay = 1000,
  setAppliedQuery = () => {},
  onFocus = () => {},
  onBlur = () => {},
}) => {
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onType(e.target.value);
    applyQuery(e.target.value);
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        value={query}
        placeholder="Enter a part of the name"
        className="input"
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};
