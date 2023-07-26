import React, { useCallback, useEffect, useRef } from 'react';
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
  const ApplyQuerry = useCallback(debounce(onAppliedQuerry, 1000), []);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current && !selectedPerson) {
      input.current.focus();
    }
  }, [selectedPerson]);

  const handleQuerryValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQuerry(event.target.value);
    ApplyQuerry(event.target.value.trim());
  };

  return (
    <div className="dropdown-trigger">
      <input
        onFocus={() => onDropdownFocus(true)}
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
