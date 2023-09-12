import React, { useCallback, useEffect, useRef } from 'react';
import { debounce } from '../../helpers/helpers';

type Props = {
  value: string,
  handleInputField: (event: React.ChangeEvent<HTMLInputElement>) => void
  setHasFocusField: (val: boolean) => void
};

const Search: React.FC<Props> = ({
  value,
  handleInputField,
  setHasFocusField,
}) => {
  const fieldref = useRef<HTMLInputElement | null>(null);

  const setFieldFocus = useCallback(() => {
    if (fieldref.current) {
      fieldref.current.focus();
    }
  }, [fieldref]);

  useEffect(() => {
    setFieldFocus();
  }, []);

  const setHasFocusFieldWithDelay = useCallback(
    debounce(setHasFocusField, 150),
    [],
  );

  const handleBlurField = useCallback(() => {
    setHasFocusFieldWithDelay(false);
  }, []);

  const handleFocusField = useCallback(() => {
    setHasFocusField(true);
  }, []);

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
