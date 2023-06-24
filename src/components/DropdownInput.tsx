import { FC, useState } from 'react';

interface Props {
  applyFilterQuery: (...args: string[]) => void,
  setSelectMenuVisible: React.Dispatch<React.SetStateAction<boolean>>,
}

export const DropdownInput:FC<Props> = (
  { applyFilterQuery, setSelectMenuVisible },
) => {
  const [query, setQuery] = useState('');

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();

    setQuery(text);
    setSelectMenuVisible(!text.trim());
    applyFilterQuery(text.trim());
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
