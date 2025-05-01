import React from 'react';

type DropdownProps = {
  inputValue: string;
  setIsFocus: (value: boolean) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Dropdown: React.FC<DropdownProps> = ({
  inputValue,
  setIsFocus,
  handleInputChange,
}) => {
  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputValue}
          data-cy="search-input"
          onFocus={() => setIsFocus(true)}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};
