import { useEffect, useRef } from 'react';
import { Person } from '../../types/Person';
import DropdownItem from '../dropdownItem/DropdownItem';

type Props = {
  people: Person[];
  onClick: (person: Person) => void;
  isFocused: boolean;
  onFocusElement: (state: boolean) => void;
  inputValue: string;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const DropdownList = ({
  people,
  onClick,
  isFocused,
  onFocusElement,
  inputValue,
  onChangeInput,
}: Props) => {
  const dropdownMenu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownMenu.current &&
        !dropdownMenu.current.contains(e.target as Node)
      ) {
        onFocusElement(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [onFocusElement]);

  return (
    <div className={`dropdown ${isFocused && 'is-active'}`}>
      <div className="dropdown-trigger" ref={dropdownMenu}>
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={onChangeInput}
          onFocus={() => onFocusElement(true)}
        />

        {!!people.length && isFocused && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {people.map(person => (
                <DropdownItem
                  key={person.slug}
                  person={person}
                  onClick={onClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownList;
