type Props = {
  query: string;
  onQueryChange: (query: string) => void;
  onFocus: () => void;
  onBlur: () => void;
};

export const DropdownTrigger: React.FC<Props> = ({
  query,
  onQueryChange,
  onFocus,
  onBlur,
}) => {
  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        data-cy="search-input"
        value={query}
        onChange={event => onQueryChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};
