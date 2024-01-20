import React from 'react';

interface Props {
  isHide: boolean;
  setIsHide: (value: boolean) => void;
}

export const PeopleDropdown: React.FC<Props> = ({ isHide, setIsHide }) => {
  const handleClickHide = () => {
    return isHide ? setIsHide(false) : setIsHide(true);
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        // onFocus={() => setIsHide(true)}
        onClick={handleClickHide}
      />
    </div>
  );
};
