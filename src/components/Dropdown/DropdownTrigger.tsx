import React, { useContext, useState } from 'react';
import { Context } from './Context';

export const DropdownTrigger: React.FC = () => {
  const {
    inputPersonName,
    delay,
    personName,
    changeActive,
    changeInputPersonName,
    onSelected,
  } = useContext(Context);

  const [timeoutId, setTimeoutId] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPersonName = event.currentTarget.value;
    const trimmedNewPersonName = newPersonName.trim();

    changeInputPersonName(newPersonName);
    clearTimeout(timeoutId);
    setTimeoutId(
      window.setTimeout(() => {
        if (personName !== trimmedNewPersonName) {
          onSelected(trimmedNewPersonName);
        }
      }, delay),
    );
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        data-cy="search-input"
        value={inputPersonName}
        onFocus={() => changeActive(true)}
        onBlur={() => changeActive(false)}
        onChange={handleChange}
      />
    </div>
  );
};
