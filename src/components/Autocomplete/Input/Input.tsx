import React from 'react';

interface Props {
  query: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onFocus: () => void;
  // onBlur: () => void;
}

export const Input: React.FC<Props> = ({
  query,
  onChange,
  onFocus,
  // onBlur,
}) => {
  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={query}
        onChange={onChange}
        onFocus={onFocus}
        // onBlur={onBlur}
      />
    </div>
  );
};
