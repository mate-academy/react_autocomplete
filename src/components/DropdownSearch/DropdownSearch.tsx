import React from 'react';
import debounce from 'lodash.debounce';

interface Props {
  filterField: string,
  onChange: (filterField: string) => void,
  setAppliedFilter: (filterField: string) => void,
  delay: number,
  setIsOpened: (value:boolean) => void,
}

export const DropdownSearch: React.FC<Props> = React.memo((({
  filterField,
  onChange = () => { },
  setAppliedFilter = () => { },
  delay = 1000,
  setIsOpened,
}) => {
  const applyfilterField = debounce(setAppliedFilter, delay);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
    applyfilterField(event.target.value);
    setIsOpened(false);
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={filterField}
        onChange={(event) => handleSearch(event)}
      />
    </div>
  );
}));
