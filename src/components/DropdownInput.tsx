import React from 'react';

interface DropdownInputProps {
  onFocus?: () => void,
  onBlur?: () => void,
  query: string,
  onQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  inputRef: React.RefObject<HTMLInputElement>
}

export const DropdownInput: React.FC<DropdownInputProps> = React.memo(({
  onFocus = () => {},
  onBlur = () => {},
  query,
  onQueryChange = () => {},
  inputRef,
}) => {
  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        onFocus={onFocus}
        onBlur={onBlur}
        ref={inputRef}
        value={query}
        onChange={onQueryChange}
      />
    </div>
  );
});
