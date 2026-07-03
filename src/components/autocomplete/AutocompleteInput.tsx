import React from 'react';

interface Props {
  onFocusChange: (isOpen: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
}

export const AutocompleteInput: React.FC<Props> = ({
  onFocusChange,
  name,
  onNameChange,
}) => {
  return (
    <input
      type="text"
      placeholder="Enter a part of the name"
      className="input"
      onFocus={() => onFocusChange(true)}
      onBlur={() => onFocusChange(false)}
      data-cy="search-input"
      value={name}
      onChange={event => {
        onNameChange(event.target.value);
        onFocusChange(true);
      }}
    />
  );
};
