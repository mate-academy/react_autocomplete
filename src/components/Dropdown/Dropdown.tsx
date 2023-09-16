/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import './Dropdown.scss';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setApplyQuery: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPerson: React.Dispatch<React.SetStateAction<Person | null>>;
  delay: number;
}

export const Dropdown: React.FC<Props> = React.memo(({
  people,
  query,
  setQuery = () => {},
  setApplyQuery = () => {},
  setCurrentPerson = () => {},
  delay = 500,
}) => {
  const [focusedField, setFocusedField] = useState(false);
  const applyValue = useCallback(debounce(setApplyQuery, delay), []);

  const fieldChange = (value: string) => {
    setQuery(value);
    applyValue(value);
  };

  const onSelected = (person: Person) => {
    setCurrentPerson(person);
    setFocusedField(false);
    setQuery(person.name);
    setApplyQuery(person.name);
  };

  return (
    <div
      className={cn('dropdown', { 'is-active': focusedField })}
    >
      <div className="dropdown-trigger">
        <input
          name="name"
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onFocus={() => setFocusedField(true)}
          onBlur={() => setFocusedField(false)}
          onChange={({ target }) => fieldChange(target.value)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {people.length ? (
            people.map(((person: Person) => (
              <div className="dropdown-item" key={person.name}>
                <p
                  className="has-text-link"
                  onMouseDown={() => onSelected(person)}
                >
                  {person.name}
                </p>
              </div>
            )))
          ) : (
            <div className="dropdown-item dropdown-item--disabled">
              <p className="has-text-link">No matching suggestions</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
});
