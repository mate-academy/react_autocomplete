import React, { useRef } from 'react';
import { debounce } from '../../helpers/helpers';

type Props = {
  value: string,
  handleInputField: (event: React.ChangeEvent<HTMLInputElement>) => void
  setHasFocusField: (value: boolean) => void
};

const Search: React.FC<Props> = ({
  value,
  handleInputField,
  setHasFocusField,
}) => {
  const fieldref = useRef<HTMLInputElement | null>(null);

  const setHasFocusFieldWithDelay = debounce(setHasFocusField, 150);

  const handleBlurField = () => {
    setHasFocusFieldWithDelay(false);
  };

  const handleFocusField = () => {
    setHasFocusField(true);
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        ref={fieldref}
        value={value}
        onBlur={handleBlurField}
        onFocus={handleFocusField}
        onChange={handleInputField}
        placeholder="Enter a part of the name"
        className="input"
      />
    </div>
  );
};

export default Search;
