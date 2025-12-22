import React from 'react';

type Props = {
  query: string;
  onQueryChange: (newQuery: string) => void;
  onToggleMenu: (isOpen: boolean) => void;
};

export const DropDownInput: React.FC<Props> = ({
  query,
  onQueryChange,
  onToggleMenu,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      onToggleMenu(false);
    }, 200);
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        value={query}
        onFocus={() => onToggleMenu(true)}
        onBlur={handleBlur}
        onChange={event => handleChange(event)}
        className="input"
        data-cy="search-input"
      />
    </div>
  );
};
