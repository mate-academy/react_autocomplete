import React from 'react';

interface Props {
  onFocus: (isOpen: boolean) => void;
  name: string;
  setName: (value: string) => void;
}

export const AutocompleteInput: React.FC<Props> = ({
  onFocus,
  name,
  setName = () => {},
}) => {
  return (
    <input
      type="text"
      placeholder="Enter a part of the name"
      className="input"
      onFocus={() => onFocus(true)}
      onBlur={() => onFocus(false)}
      data-cy="search-input"
      value={name}
      onChange={event => setName(event.target.value)}
    />
  );
};
