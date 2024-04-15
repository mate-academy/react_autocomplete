import React from 'react';
import { Lang } from '../types/Lang';

type Props = {
  value: Lang;
  onChange?: (lang: Lang) => void;
};

export const LangSelector: React.FC<Props> = ({
  value,
  onChange = () => {},
}) => {
  return (
    <select
      name=""
      id=""
      value={value}
      onChange={event => onChange(event.target.value as Lang)}
    >
      <option value={Lang.EN}>English</option>
      <option value={Lang.UA}>Українська</option>
    </select>
  );
};
