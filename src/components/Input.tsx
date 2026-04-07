// ..Inpput.tsx
interface InputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
}

export const Input = ({ value, onChange, onFocus }: InputProps) => {
  return (
    <>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
        />
      </div>
    </>
  );
};
