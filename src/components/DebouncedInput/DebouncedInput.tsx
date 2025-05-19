import React, { useEffect, useState } from 'react';

interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  delay?: number;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = React.memo(
  ({ value, onChange, onFocus = () => {}, delay = 300 }) => {
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        onChange(tempValue);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [tempValue, delay, onChange]);

    useEffect(() => {
      setTempValue(value);
    }, [value]);

    return (
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        data-cy="search-input"
        value={tempValue}
        onChange={e => setTempValue(e.target.value)}
        onFocus={onFocus}
      />
    );
  },
);

DebouncedInput.displayName = 'DebouncedInput';
