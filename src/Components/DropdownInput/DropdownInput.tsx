interface Props {
  query: string,
  handleOnBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void,
  setIsInputFocused: (param: boolean) => void,
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export const DropdownInput: React.FC<Props> = ({
  query,
  handleOnBlur,
  setIsInputFocused,
  handleOnChange,
}) => {
  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={query}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={() => setIsInputFocused(true)}
      />
    </div>
  );
};
