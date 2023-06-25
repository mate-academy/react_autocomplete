import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from 'react';

type SetQuaryFunc = (value: string) => void;

type Props = {
  applyQuery: SetQuaryFunc;
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
};

export const DropdownInput: FC<Props> = ({
  applyQuery,
  setShowSuggestions,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    applyQuery(event.target.value);
    setShowSuggestions(true);
  };

  return (
    <input
      type="text"
      placeholder="Enter a part of the name"
      className="input"
      value={searchQuery}
      onChange={handleChange}
    />
  );
};
