import { useState, useMemo, useRef } from 'react';

import './Autocomplete.scss';
import { Person } from '../../../types/Person';

interface Props {
  options: Person[],
  delay: number,
  setActiveOption: (person: Person) => void
}

export const Autocomplete: React.FC<Props> = ({
  options,
  delay,
  setActiveOption,
}) => {
  const [query, setQuery] = useState('');
  const [dropdownShow, setDropdownShow] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');
  const timerId = useRef(0);

  const preparedOptions = useMemo(
    () => options.filter(option => (
      option.name.toLowerCase().includes(appliedQuery.toLowerCase())
    )),
    [options, appliedQuery],
  );

  const handleDropdownItemClick = (option: Person) => {
    setQuery(option.name);
    setActiveOption(option);
    setDropdownShow(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setAppliedQuery(event.target.value);
    }, delay);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setDropdownShow(true)}
          onBlur={() => setDropdownShow(false)}
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
        style={{
          display: dropdownShow ? 'block' : 'none',
        }}
      >
        <div className="dropdown-content">
          {preparedOptions.length > 0
            ? preparedOptions.map((option: Person) => (
              <div
                className="dropdown-item"
                onMouseDown={() => handleDropdownItemClick(option)}
                key={option.name}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleDropdownItemClick(option);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <p
                  className={Math.random() > 0.5
                    ? 'has-text-link'
                    : 'has-text-danger'}
                >
                  {option.name}
                </p>
              </div>
            ))
            : ' No matching suggestions '}
        </div>
      </div>
    </div>
  );
};
