import { FC, memo, ChangeEvent } from 'react';

type Props = {
  query: string;
  onInputFocus: () => void;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
export const SearchInput: FC<Props> = memo(
  ({ query, onInputFocus, onInputChange }) => {
    return (
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onFocus={onInputFocus}
          onChange={onInputChange}
        />
      </div>
    );
  },
);
