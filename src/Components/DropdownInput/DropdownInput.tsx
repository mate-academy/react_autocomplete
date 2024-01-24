import debounce from 'lodash.debounce';
import { useCallback } from 'react';

type Props = {
  delay: number;
  query: string;
  setQuery: (query: string) => void;
  setAppliedQuery: (query: string) => void;
  handleOnBlur: () => void;
  handleOnFocus: () => void;
};

export const DropdownInput: React.FC<Props> = ({
  delay,
  query,
  setQuery,
  setAppliedQuery,
  handleOnBlur,
  handleOnFocus,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setQuery(event.target.value);
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={query}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
      />
    </div>
  );
};
