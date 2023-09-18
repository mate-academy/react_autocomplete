import React from 'react';

type Props = {
  query: string,
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleFocus: () => void,
  handleBlur: () => void,
};

export const DropdownInput: React.FC<Props> = ({
  query,
  handleQueryChange,
  handleFocus,
  handleBlur,
}) => (
  <div className="dropdown-trigger">
    <input
      type="text"
      placeholder="Enter a part of the name"
      className="input"
      value={query}
      onChange={handleQueryChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  </div>
);
