import React from 'react';

interface Props {
  query: string;
  isHide: boolean;
  setQuery: (value: string) => void;
  setIsHide: (value: boolean) => void;
  applyQuery: (value: string) => void;
}

export const PeopleDropdown: React.FC<Props> = ({
  query,
  isHide,
  setIsHide,
  setQuery,
  applyQuery,
}) => {
  const handleClickHide = () => {
    return isHide ? setIsHide(false) : setIsHide(true);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsHide(true);
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={query}
        onChange={handleQueryChange}
        onClick={handleClickHide}
      />
    </div>
  );
};
