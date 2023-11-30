import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  delay: number,
  onSelected: (person: Person | null) => void,
  selectedPerson: Person | null,
  people: Person[],
};

export const Autocomplete: React.FC<Props> = ({
  delay,
  onSelected = () => {},
  selectedPerson,
  people,
}) => {
  const hideDropdownDelay = 200;
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const visiblePeople = useMemo(() => (
    people.filter(person => (
      person.name.toLowerCase().includes(appliedQuery.toLowerCase())
    ))), [appliedQuery, people]);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const hideDropdownWithDelay = useCallback(
    debounce(() => setIsInputFocused(false), hideDropdownDelay), [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const selectPerson = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setIsInputFocused(false);
  };

  const handleInputFocus = () => {
    setQuery('');
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    if (!visiblePeople.length) {
      setQuery('');
      applyQuery('');
      onSelected(null);
    }

    hideDropdownWithDelay();
  };

  return (
    <div
      className={cn('dropdown', {
        'is-active': isInputFocused,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          placeholder="Enter a part of the name"
          className={cn('input', {
            'is-focused': isInputFocused,
          })}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}

        />
      </div>

      <div
        className="dropdown-menu"
        id="dropdown-menu"
        role="menu"
      >
        <div className="dropdown-content">
          {visiblePeople.length
            ? (visiblePeople.map(person => (
              <button
                key={person.slug}
                type="button"
                className={cn('dropdown-item', {
                  'is-active': person.slug === selectedPerson?.slug,
                })}
                onClick={() => selectPerson(person)}
              >
                {person.name}
              </button>
            )))
            : 'No matching suggestions '}
        </div>
      </div>
    </div>
  );
};
