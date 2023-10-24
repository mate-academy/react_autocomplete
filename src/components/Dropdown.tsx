import React, {
  useCallback,
  useMemo, useState,
} from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  setOnSelected: (val: Person) => void;
};

export const Dropdown: React.FC<Props> = ({
  people,
  setOnSelected,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce((value: string) => {
      setAppliedQuery(value);
      setIsFocused(true);
    }, 1000),
    [appliedQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => people.filter((person) => (
    person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase())
  )), [people, appliedQuery]);

  const handlePerson = (person: Person) => {
    setOnSelected(person);
    setQuery(person.name);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
        />
      </div>

      {isFocused && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length > 0
              ? (
                filteredPeople.map(person => (
                  <div
                    role="button"
                    key={person.slug}
                    tabIndex={0}
                    className="dropdown-item dropdown-item--person"
                    onMouseDown={() => handlePerson(person)}
                  >
                    <p
                      className={cn({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                )))
              : ('No matching suggestions')}
          </div>
        </div>
      )}
    </div>
  );
};
