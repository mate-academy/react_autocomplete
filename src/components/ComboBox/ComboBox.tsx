import React, { useState, useCallback } from 'react';
import { Person } from '../../types/Person';
import classNames from 'classnames';
import './ComboBox.scss';

type Props = {
  people: Person[];
  delay: number;
  onSelect: (person: Person | null) => void;
  onChange: (query: string) => void;
};

function debounce(callback: (query: string) => void, delay: number) {
  let timerId = 0;

  return (arg: string) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(arg);
    }, delay);
  };
}

export const ComboBox: React.FC<Props> = ({
  people,
  delay = 300,
  onSelect = () => {},
  onChange = () => {},
}) => {
  const [focustInput, setFocustInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const applyQuery = useCallback(debounce(onChange, delay), [delay]);

  const handleClick = (person: Person) => {
    setInputValue(person.name);
    onSelect(person);
    onChange('');
    setFocustInput(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(null);
    const val = event.target.value;

    setInputValue(val);
    applyQuery(val);
  };

  return (
    <div
      className={classNames('dropdown', {
        'is-active': focustInput && people.length,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onFocus={() => setFocustInput(true)}
          value={inputValue}
          onChange={handleChange}
        />
        {''}
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {people.map((person: Person) => {
            return (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleClick(person)}
              >
                <p>{person.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
