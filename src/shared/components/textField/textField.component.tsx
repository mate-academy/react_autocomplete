import { text } from '../../constants/text';
import React from 'react';
import { TextFieldProps } from './textFIeld.typses';

export const TextFieldComponent: React.FC<TextFieldProps> = ({
  onChange,
  value,
  onBlur,
  onFocus,
}) => {
  return (
    <div className="dropdown-trigger">
      <input
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        value={value}
        type="text"
        placeholder={text.enterPartOfTheName}
        className="input"
        data-cy="search-input"
      />
    </div>
  );
};
