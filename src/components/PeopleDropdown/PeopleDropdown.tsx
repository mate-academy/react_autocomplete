import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  query: string;
  isHide: boolean;
  selectedPerson: Person | null;
  setQuery: (value: string) => void;
  setIsHide: (value: boolean) => void;
  applyQuery: (value: string) => void;
}

export const PeopleDropdown: React.FC<Props> = ({
  query,
  isHide,
  selectedPerson,
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
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={query && selectedPerson?.name}
        onChange={handleQueryChange}
        // onFocus={handleClickHide}
        onClick={handleClickHide}
      />
    </div>
  );
};
