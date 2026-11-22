import React from 'react';

type Props = {
  currValue: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocused?: () => void;
  onBlur?: () => void;
};

export const Trigger: React.FC<Props> = ({
  currValue,
  onFocused,
  onChange,
  onBlur,
}) => {
  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        data-cy="search-input"
        value={currValue}
        onChange={onChange}
        onFocus={onFocused}
        onBlur={onBlur}
      />
    </div>
  );
};
