import { useContext, useState } from 'react';
import { DropdownDataContext } from './DropdownData';

export const DropdownInput = (
) => {
  const dropdownData = useContext(DropdownDataContext);
  const [query, setQuery] = useState('');

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;

    setQuery(text);
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
