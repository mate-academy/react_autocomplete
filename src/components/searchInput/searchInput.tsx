import React, { useEffect, useRef, useState } from 'react';
import { Person } from '../../types/Person';

interface Props {
  delay: number;
  setFullField: React.Dispatch<React.SetStateAction<string>>;
  setSelectedPerson: React.Dispatch<React.SetStateAction<null | Person>>;
  selectedPerson: null | Person;
  setFocus: React.Dispatch<React.SetStateAction<boolean>>;
  setDelay?: React.Dispatch<React.SetStateAction<number>>;
}

export const SearchInput: React.FC<Props> = ({
  delay,
  setFullField,
  selectedPerson,
  setSelectedPerson,
  setFocus,
}) => {
  const [field, setField] = useState('');

  const timerId = useRef<NodeJS.Timeout | number>(0);

  const previousField = useRef('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPerson(null);
    setField(e.target.value);

    if (timerId.current) {
      window.clearTimeout(timerId.current as number);
    }

    timerId.current = window.setTimeout(() => {
      if (previousField.current !== e.target.value) {
        const newField = e.target.value;

        setFullField(newField.trim());

        previousField.current = e.target.value;
      }
    }, delay);
  };

  useEffect(() => {
    if (selectedPerson) {
      setField(selectedPerson.name);
      setFocus(false);
    }
  }, [selectedPerson, setFocus]);

  const handleBlur = () => {
    if (!field) {
      setFocus(false);
    }
  };

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        data-cy="search-input"
        value={field}
        onChange={e => handleChange(e)}
        onFocus={() => setFocus(true)}
        onBlur={handleBlur}
      />
    </div>
  );
};
