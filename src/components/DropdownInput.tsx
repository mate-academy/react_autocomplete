import {
  ChangeEvent,
  FC,
  useState,
} from 'react';

type SetQuaryFunc = (value: string) => void;

type Props = {
  applyQuery: SetQuaryFunc;
  setShowSuggestions: (value: boolean) => void;
};

export const DropdownInput: FC<Props> = ({
  applyQuery,
  setShowSuggestions,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    applyQuery(event.target.value);
    setShowSuggestions(false);
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
