interface Props {
  onFocus: (isFocused: boolean) => void;
  searchQuery: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DropdownInput: React.FC<Props> = (props) => {
  const { onFocus, searchQuery, onChange } = props;

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        onFocus={() => onFocus(true)}
        onBlur={() => setTimeout(() => onFocus(false), 100)}
        value={searchQuery}
        onChange={onChange}
      />
    </div>
  );
};
