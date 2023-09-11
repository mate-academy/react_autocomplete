import {
  FC,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import debounce from 'lodash.debounce';

type TSearchFieldProps = {
  searchField: string,
  handleInputField: (event: React.ChangeEvent<HTMLInputElement>) => void
  setHasFocusField: (val: boolean) => void
};

export const SearchField: FC<TSearchFieldProps> = ({
  searchField,
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
        value={searchField}
        onBlur={handleBlurField}
        onFocus={handleFocusField}
        onChange={handleInputField}
        placeholder="Enter a part of the name"
        className="input"
      />
    </div>
  );
};
