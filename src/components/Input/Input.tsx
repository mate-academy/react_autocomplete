import React, { useRef } from 'react';

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
  const timerId = useRef(0);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setAppliedQuery(event.target.value);
    }, delay);
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
