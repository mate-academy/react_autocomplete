import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';
import { DropdownContent } from '../DropdownContent';
import { peopleFromServer } from '../../data/people';
import { DropdownInput } from '../DropdownInput';

interface Props {
  setSelectedPerson: (person: Person) => void;
  delay: number,
}

export const Dropdown: React.FC<Props> = React.memo(({
  setSelectedPerson,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!e.relatedTarget?.classList.contains('dropdown-item')) {
      setIsInputFocused(false);
    }
  };

  const visiblePeople = useMemo(() => {
    const normalizedQuery = appliedQuery.trim().toLowerCase();

    return peopleFromServer
      .filter(person => person.name.toLowerCase().includes(normalizedQuery));
  }, [appliedQuery]);

  const handleItemClick = (person: Person) => {
    setQuery(person.name);
    setSelectedPerson(person);
    setAppliedQuery(person.name);
    setIsInputFocused(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setQuery(event.target.value);
  };

  return (
    <div className="dropdown is-active">
      <DropdownInput
        query={query}
        handleOnBlur={handleOnBlur}
        setIsInputFocused={setIsInputFocused}
        handleOnChange={handleOnChange}
      />

      {isInputFocused && (
        <div
          className="dropdown-menu"
          role="menu"
          style={{
            maxHeight: 400,
            overflow: 'auto',
          }}
        >
          {!visiblePeople.length ? (
            <span>No matching suggestions</span>
          ) : (
            <DropdownContent
              listOfPeople={visiblePeople}
              handleItemClick={handleItemClick}
            />
          )}
        </div>
      )}
    </div>
  );
});
