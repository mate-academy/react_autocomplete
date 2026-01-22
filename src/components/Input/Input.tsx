import React from 'react';

type Props = {
  query: string;
  delay?: number;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    delay?: number,
  ) => void;
  onFocusChange: (isFocus: boolean) => void;
};

export const Input: React.FC<Props> = ({
  onChange,
  query,
  delay,
  onFocusChange,
}) => {
  return (
    <input
      type="text"
      value={query}
      placeholder="Enter a part of the name"
      className="input"
      data-cy="search-input"
      onChange={event => onChange(event, delay)}
      onFocus={() => onFocusChange(true)}
      onBlur={() => onFocusChange(false)}
    />
  );
};
