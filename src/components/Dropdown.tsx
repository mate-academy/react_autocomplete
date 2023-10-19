import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { DropdownInput } from './DropdownInput';
import { DropdownMenu } from './DropdownMenu';
import { Person } from '../types/Person';

interface DropdownProps {
  people: Person[],
  selectedPerson: Person | null,
  onPersonSelect: (person: Person) => void,
  delay: number
}

export const Dropdown: React.FC<DropdownProps> = ({
  people,
  selectedPerson,
  onPersonSelect = () => {},
  delay = 1000,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handlePersonSelect = useCallback((person: Person) => {
    setQuery(person.name);
    onPersonSelect(person);
    setIsFocused(false);
  }, [onPersonSelect]);

  useEffect(() => {
    inputRef.current?.blur();
    setIsFocused(false);
  }, [selectedPerson]);

  return (
    <div className={classNames('dropdown', {
      'is-active': isFocused,
    })}
    >
      <DropdownInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        query={query}
        onQueryChange={handleQueryChange}
        inputRef={inputRef}
      />

      <DropdownMenu
        query={appliedQuery}
        people={people}
        onPersonSelect={handlePersonSelect}
      />

    </div>
  );
};
