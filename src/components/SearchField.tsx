import React, { useCallback } from 'react';

interface Props {
  searchQuery: string,
  onChange: (value: string) => void,
  onApplyChange: (value: string) => void,
  currentDelay: number,
}

export const SearchField: React.FC <Props> = ({
  searchQuery,
  onChange,
  onApplyChange,
  currentDelay,
}) => {
  const debounce = (func: (query: string) => void, delay: number) => {
    let timerId: NodeJS.Timeout;

    return (query: string) => {
      clearTimeout(timerId);
      timerId = setTimeout(func, delay, query);
    };
  };

  const applyQuery = useCallback(
    debounce(onApplyChange, currentDelay), [],
  );

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={searchQuery}
        onChange={(event) => {
          onChange(event.target.value);
          applyQuery(event.target.value);
        }}
      />
    </div>
  );
};
