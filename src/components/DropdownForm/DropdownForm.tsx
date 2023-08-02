import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

type Props = {
  query: string;
  onQuery: (value: string) => void;
  onAppliedQuery?: (value: string) => void;
  selectedPerson: Person | null,
  onDropdownFocus?: (value: boolean) => void;
  debounceTimer: number;
};

export const DropdownForm: React.FC<Props> = ({
  query,
  onQuery,
  onAppliedQuery = () => { },
  selectedPerson,
  onDropdownFocus = () => { },
  debounceTimer,
}) => {
  const [isInputInFocus, setIsInputInFocus] = useState(false);
  const applyQuery = useCallback(debounce(onAppliedQuery, debounceTimer), []);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current && !selectedPerson && isInputInFocus) {
      input.current.focus();
    }
  }, [selectedPerson]);

  const handleInputFocus = () => {
    onDropdownFocus(true);
    setIsInputInFocus(true);
  };

  const handleQueryValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQuery(event.target.value);
    applyQuery(event.target.value.trim());
  };

  return (
    <div className="dropdown-trigger">
      <input
        onFocus={handleInputFocus}
        ref={input}
        onChange={handleQueryValue}
        value={query}
        type="text"
        placeholder="Search for a person"
        className="input"
      />
    </div>
  );
};
