import React from 'react';

type Props = {
  query: string,
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  setIsDropdownVisible: (value: boolean) => void,
};

export const SearchBar: React.FC<Props> = ({
  query,
  handleQueryChange,
  setIsDropdownVisible,
}) => (
  <div className="dropdown-trigger">
    <input
      onFocus={() => setIsDropdownVisible(true)}
      type="text"
      placeholder="Enter a part of the name"
      className="input"
      value={query}
      onChange={handleQueryChange}
    />
  </div>
);
