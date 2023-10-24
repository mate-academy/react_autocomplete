type Props = {
  value: string;
  type: string;
  placeholder: string;
  onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  focusChanger: (state: boolean) => void;
};

export const Input: React.FC<Props> = ({
  value,
  type,
  placeholder,
  onChangeValue,
  focusChanger,
}) => {
  return (
    <div className="dropdown-trigger">
      <input
        value={value}
        type={type}
        placeholder={placeholder}
        className="input"
        onChange={(event => onChangeValue(event))}
        onFocus={() => focusChanger(true)}
        onBlur={() => focusChanger(false)}
      />
    </div>
  );
};
