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
};

export const DropdownForm: React.FC<Props> = ({
  querry,
  onQuerry,
  onAppliedQuerry = () => { },
  selectedPerson,
  onDropdownFocus = () => { },
}) => {
  const [defoultImputFocus, setDefoultImputFocus] = useState(false);
  const ApplyQuerry = useCallback(debounce(onAppliedQuerry, 1000), []);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current && !selectedPerson && defoultImputFocus) {
      input.current.focus();
    }
  }, [selectedPerson]);

  const handleImputFocus = useCallback(() => {
    onDropdownFocus(true);
    setDefoultImputFocus(true);
  }, []);

  const handleQuerryValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQuerry(event.target.value);
    ApplyQuerry(event.target.value.trim());
  };

  return (
    <div className="dropdown-trigger">
      <input
        onFocus={handleImputFocus}
        ref={input}
        onChange={handleQuerryValue}
        value={querry}
        type="text"
        placeholder="Enter a part of the name"
        className="input"
      />
    </div>
  );
};
