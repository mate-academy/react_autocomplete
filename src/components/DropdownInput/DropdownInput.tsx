import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import { Person } from '../../types/Person';
import { DropdownMenu } from '../DropDownMenu';

type Props = {
  people: Person[];
  debounceDelay: number;
  onSelect: (person: Person | null) => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function getFilteredPeople(peopleList: Person[], name: string) {
  const result = peopleList
    .filter(person => person.name.toLowerCase().includes(name.toLowerCase()));

  if (result.length === 0) {
    return ['No matching suggestions'];
  }

  return result;
}

export const DropdownInput: React.FC<Props> = React
  .memo(({ people, debounceDelay, onSelect }) => {
    const [filter, setFilter] = useState<string>('');
    const [appliedFilter, setAppliedFilter] = useState<string>('');
    const [selectPerson, setSelectPerson] = useState<Person | null>(null);
    const [isMenuActive, setIsMenuActive] = useState<boolean>(false);
    const [isInputFocus, setIsInputFocus] = useState<boolean>(false);

    const filteredPeople = useMemo(() => {
      return getFilteredPeople(people, appliedFilter);
    }, [appliedFilter]);

    const applyFilter = useCallback(
      debounce(setAppliedFilter, debounceDelay),
      [],
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
      <div className={`dropdown ${isMenuActive ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <p className="control has-icons-left">
            <input
              type="text"
              ref={ref}
              placeholder="Enter a part of the name"
              className={`input ${selectPerson ? 'is-success' : ''}`}
              value={filter}
              onChange={handleInputValue}
              onFocus={handleInputFocus}
              onBlur={() => setIsMenuActive(false)}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-user" />
            </span>
          </p>
        </div>
        <button
          type="button"
          className="button is-light has-icons"
          onClick={reset}
        >
          <i className="fa-solid fa-user-xmark" />
        </button>
        <DropdownMenu
          people={filteredPeople}
          onSelect={setSelectPerson}
          personName={filter}
        />
      </div>
    );
  });
