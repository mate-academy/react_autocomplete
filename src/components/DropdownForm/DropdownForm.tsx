import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

type Props = {
  querry: string;
  onQuerry: (value: string) => void;
  onAppliedQuerry?: (value: string) => void;
  selectedPerson: Person | null,
  onDropdownFocus?: (value: boolean) => void;
  debounceTimer: number;
};

export const DropdownForm: React.FC<Props> = ({
  querry,
  onQuerry,
  onAppliedQuerry = () => { },
  selectedPerson,
  onDropdownFocus = () => { },
  debounceTimer,
}) => {
  const [defoultImputFocus, setDefoultImputFocus] = useState(false);
  const applyQuerry = useCallback(debounce(onAppliedQuerry, debounceTimer), []);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current && !selectedPerson && defoultImputFocus) {
      input.current.focus();
    }
  }, [selectedPerson]);

  const handleImputFocus = () => {
    onDropdownFocus(true);
    setDefoultImputFocus(true);
  };

  const handleQuerryValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQuerry(event.target.value);
    applyQuerry(event.target.value.trim());
  };

  return (
    <div className="dropdown-trigger">
      <input
        onFocus={handleImputFocus}
        ref={input}
        onChange={handleQuerryValue}
        value={querry}
        type="text"
        placeholder="Search for a person"
        className="input"
      />
    </div>
  );
};
