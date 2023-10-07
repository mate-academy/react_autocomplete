import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import debounce from 'lodash.debounce';

import { Dropdownmenu } from '../DropDownMenu';
import { Person } from '../../types/Person';

type Props = {
  people: Person[],
  debounceDelay: number,
  onSelect: (person: Person | null) => void,
};

function getFilteredPeople(peopleList: Person[], name: string) {
  const list = peopleList
    .filter(person => person.name.toLowerCase().includes(name.toLowerCase()));

  if (list.length === 0) {
    return ['No matching suggestions'];
  }

  return list;
}

export const DropdownInput: React.FC<Props> = React
  .memo(({ people, debounceDelay, onSelect }) => {
    const [selectPerson, setSelectPerson] = useState<Person | null>(null);
    const [isMenuActive, setIsMenuActive] = useState<boolean>(false);
    const [isInputFocus, setIsInputFocus] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>('');
    const [appliedFilter, setAppliedFilter] = useState<string>('');

    const filteredPeople = useMemo(() => {
      return getFilteredPeople(people, appliedFilter);
    }, [appliedFilter]);

    const applyFilter = useCallback(
      debounce(setAppliedFilter, debounceDelay), [],
    );

    useEffect(() => {
      if (selectPerson) {
        setFilter(selectPerson.name);
        setAppliedFilter('');
        setIsInputFocus(false);
        onSelect(selectPerson);
      }
    }, [selectPerson]);

    const handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(event.target.value);
      applyFilter(event.target.value);
      setSelectPerson(null);
      onSelect(null);
    };

    const ref = useRef<HTMLInputElement | null>(null);

    const handleInputFocus = () => {
      setIsMenuActive(true);
      setIsInputFocus(true);
    };

    const reset = () => {
      setFilter('');
      setSelectPerson(null);
      setAppliedFilter('');
      onSelect(null);

      if (isInputFocus) {
        ref.current?.focus();
        setIsInputFocus(false);
      }
    };

    return (
      <div
        className={`dropdown ${isMenuActive ? 'is-active' : ''}`}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            ref={ref}
            placeholder="Enter a part of the name"
            className="input"
            value={filter}
            onChange={handleInputValue}
            onFocus={handleInputFocus}
            onBlur={() => setIsMenuActive(false)}
          />
        </div>

        <button
          type="button"
          className="button is-light has-icons"
          onClick={reset}
        >
          Clear
        </button>

        <Dropdownmenu
          people={filteredPeople}
          onSelect={setSelectPerson}
          personName={filter}
        />
      </div>
    );
  });
