import classNames from 'classnames';
import { Person } from '../../types/Person';
import { useCallback } from 'react';
import debounce from 'lodash.debounce';

interface DropdownProps {
  isDropdownActive: boolean;
  setIsDropdownActive: (value: boolean) => void;
  field: React.RefObject<HTMLInputElement>;
  filteredPeople: Person[];
  onSelected: (person: Person) => void;
  setIsChanged: (value: boolean) => void;
  delay: number;
  appliedQuery: string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setAppliedQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isDropdownActive,
  setIsDropdownActive,
  field,
  filteredPeople,
  onSelected,
  setIsChanged,
  delay,
  inputValue,
  setInputValue,
  appliedQuery,
  setAppliedQuery,
}) => {
  const applyQuery = useCallback(
    debounce((value: string) => {
      setAppliedQuery(value);
    }, delay),
    [delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    if (newValue !== appliedQuery) {
      applyQuery(newValue);
    }
  };

  return (
    <div className={classNames('dropdown', { 'is-active': isDropdownActive })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onFocus={() => setIsDropdownActive(true)}
          ref={field}
          value={inputValue}
          onChange={e => {
            handleQueryChange(e);
            setIsChanged(true);
          }}
        />
      </div>
      {filteredPeople.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => {
              return (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => {
                    onSelected(person);
                    setInputValue(person.name);
                    setAppliedQuery(person.name);
                    setIsChanged(false);
                  }}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
