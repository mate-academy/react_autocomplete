import React, { useCallback, useMemo, useState } from 'react';
import './Dropdown.scss';
import debounce from 'lodash.debounce';
import cn from 'classnames';

type Props = {
  options: string[];
  onSelected: (name: string | null) => void;
  selectedPerson?: string;
  delay?: number;
};

export const Dropdown: React.FC<Props> = ({
  options,
  onSelected,
  selectedPerson,
  delay = 300,
}) => {
  const [input, setInput] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPerson) {
      onSelected(null);
    }

    setInput(e.target.value);
    applyQuery(e.target.value);
  };

  const filteredOptions = useMemo(
    () =>
      options.filter(option =>
        option.toLowerCase().includes(appliedQuery.toLowerCase()),
      ),
    [appliedQuery, options],
  );

  const handleOptionSelect = (option: string) => {
    setInput(option);
    onSelected(option);
    setAppliedQuery(option);
  };

  const toggleDropdownVisibility = (isVisible: boolean) => {
    setTimeout(() => setActiveDropdown(isVisible), 100);
  };

  return (
    <div className={cn('dropdown', { 'is-active': activeDropdown })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={input}
          onChange={handleInputChange}
          onFocus={() => toggleDropdownVisibility(true)}
          onBlur={() => toggleDropdownVisibility(false)}
        />
      </div>
      <div className="dropdown-menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredOptions.length ? (
            filteredOptions.map(option => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={option}
                onClick={() => handleOptionSelect(option)}
              >
                <p className="has-text-link">{option}</p>
              </div>
            ))
          ) : (
            <div
              className="notification is-danger is-light mt-3"
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
