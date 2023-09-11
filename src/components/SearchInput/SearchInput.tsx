interface Props {
  query: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
}

export const SearchInput: React.FC<Props> = (
  {
    query,
    onChange,
    onFocus,
  },
) => {
  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        onFocus={onFocus}
        value={query}
        onChange={onChange}
      />
    </div>
  );
};
