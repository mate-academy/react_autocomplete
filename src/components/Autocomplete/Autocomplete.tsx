import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';

import { Person } from '../../types/Person';
import { PersonList } from '../PersonList';
import './Autocomplete.scss';

type Props = {
  people: Person[],
  onSelect: (person: Person) => void,
  delay: number,
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelect,
  delay,
}) => {
  const [isListVisible, setIsListVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue, setDebouncedInputValue] = useState(inputValue);
  const [wasThereClick, setWasThereClick] = useState(true);

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setIsListVisible(true);
      setWasThereClick(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setIsListVisible(false);
    setWasThereClick(false);
  };

  const handleItemClick = useCallback((person: Person) => {
    onSelect(person);
    setInputValue(person.name);
    setIsListVisible(false);
    setWasThereClick(true);
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (inputValue !== debouncedInputValue) {
        setDebouncedInputValue(inputValue);
      }

      setIsListVisible(true);
    }, delay);

    return () => clearTimeout(timerId);
  }, [inputValue]);

  const filteredPeople = useMemo(() => people.filter(person => {
    return person.name
      .toLowerCase()
      .includes(debouncedInputValue.toLowerCase());
  }), [debouncedInputValue, people]);

  return (
    <div
      className={classNames('dropdown', {
        // if there was no click on the list then show the list
        'is-active': isListVisible && !wasThereClick,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onFocus={handleInputFocus}
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length !== 0 ? (
            <PersonList
              people={filteredPeople}
              onItemClick={handleItemClick}
            />
          ) : (
            <p className="dropdown-content__no-suggestions">
              No matching suggestions
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
