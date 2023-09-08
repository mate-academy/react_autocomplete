import React from 'react';

type Props = {
  query: string;
  handleQueryChange: (newQuery: string) => void;
  setIsListShown: (isListShown: boolean) => void;
  handleResetQuery: () => void;
};

export const DropdownInput: React.FC<Props> = React.memo(({
  query,
  handleQueryChange,
  setIsListShown,
  handleResetQuery,
}) => {
  return (
    <div className="dropdown-trigger">
      <div className="control has-icons-right">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          onFocus={() => setIsListShown(true)}
        />

        {query && (
          <span className="icon is-right">
            <button
              type="button"
              className="delete"
              aria-label="close"
              onClick={handleResetQuery}
            />
          </span>
        )}
      </div>
    </div>
  );
});
