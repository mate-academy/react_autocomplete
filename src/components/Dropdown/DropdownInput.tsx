import { useContext, useState } from 'react';
import { DropdownDataContext } from './DropdownData';

export const DropdownInput = (
) => {
  const dropdownData = useContext(DropdownDataContext);
  const [query, setQuery] = useState('');

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();

    setQuery(text);
    dropdownData?.setSelectMenuVisible(!text.trim());
    dropdownData?.applyFilterQuery(text.trim());
  };

  return (
    <input
      type="text"
      placeholder="Enter a part of the name"
      className="input"
      value={query}
      onChange={onInputChange}
    />
  );
};
