import { memo } from 'react';

interface Props {
  query: string;
  onQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export const AutocompleteInput = memo(
  ({ query, onQueryChange, onFocus, onBlur }: Props) => (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        data-cy="search-input"
        value={query}
        onChange={onQueryChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  ),
);

AutocompleteInput.displayName = 'AutocompleteInput';
