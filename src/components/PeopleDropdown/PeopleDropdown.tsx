import React from 'react';
import { Person } from '../../types/Person';

interface Props {
  isHide: boolean;
  selectedPerson: Person | null;
  setIsHide: (value: boolean) => void;
}

export const PeopleDropdown: React.FC<Props> = ({
  isHide,
  selectedPerson,
  setIsHide,
}) => {
  const handleClickHide = () => {
    return isHide ? setIsHide(false) : setIsHide(true);
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={selectedPerson?.name}
        // onFocus={() => setIsHide(true)}
        onClick={handleClickHide}
      />
    </div>
  );
};
