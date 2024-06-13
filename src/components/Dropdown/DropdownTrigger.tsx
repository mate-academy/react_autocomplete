import React, { useState } from 'react';

type Props = {
  delay: number;
  onTrigger: (activate: boolean) => void;
  onFilter: (partOfName: string) => void;
};

export const DropdownTrigger: React.FC<Props> = ({
  delay,
  onTrigger,
  onFilter,
}) => {
  const [partOfName, setPartOfName] = useState('');

  let timeoutId = 0;

  const handleChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    const newPartOfName = event.currentTarget.value;

    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      if (partOfName !== newPartOfName) {
        setPartOfName(newPartOfName);
        onFilter(newPartOfName);
      }
    }, delay);
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        data-cy="search-input"
        onFocus={() => onTrigger(true)}
        onBlur={() => onTrigger(false)}
        onChange={handleChange}
      />
    </div>
  );
};
