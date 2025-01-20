import React from 'react';

export type TextFieldProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onBlur: () => void;
  onFocus: () => void;
};
