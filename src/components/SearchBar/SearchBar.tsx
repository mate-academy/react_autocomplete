import React from 'react';

type Props = {
  query: string,
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
};

export const SearchBar: React.FC<Props> = ({
  query,
  handleQueryChange,
}) => (
  <div className="dropdown-trigger">
    <input
      type="text"
      placeholder="Enter a part of the name"
      className="input"
      value={query}
      onChange={handleQueryChange}
    />
  </div>
);
