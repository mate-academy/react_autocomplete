import React from 'react';

type Props = {
  query: string;
  handleQueryChange: (newQuery: string) => void;
  handleResetQuery: () => void;
};

export const DropdownTrigger: React.FC<Props> = React.memo(
  ({
    query,
    handleQueryChange,
    handleResetQuery,
  }) => {
    return (
      <div className="dropdown-trigger ">
        <div className="control has-icons-right ">
          <input
            type="text"
            className="input"
            placeholder="Enter a part of the name"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
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
  },
);
