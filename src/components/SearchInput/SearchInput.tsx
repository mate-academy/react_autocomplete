type Props = {
  query: string;
  setIsFocused: (value: boolean) => void;
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearInput: () => void;
};

export const SearchInput: React.FC<Props> = ({
  query,
  setIsFocused,
  handleQueryChange,
  handleClearInput,
}) => {
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (relatedTarget && relatedTarget.closest('.dropdown-menu')) {
      return;
    }

    setTimeout(() => setIsFocused(false), 200);
  };

  return (
    <div className="dropdown-trigger field has-addons">
      <div className="control is-expanded">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
        />
      </div>
      {query && (
        <div className="control">
          <button
            className="button is-light"
            onClick={handleClearInput}
            data-cy="clear-button"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
