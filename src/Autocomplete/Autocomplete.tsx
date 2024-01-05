import cn from 'classnames';
import './Autocomplete.scss';
import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

interface AutocompleteProps {
  people: Person[];
  delay: number;
  onSelected: (person: Person) => void;
  filterPeople: (name: string) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = React.memo((
  {
    people,
    delay,
    onSelected,
    filterPeople,
  },
) => {
  const [callDropdown, setCallDropdown] = useState(false);
  const [name, setName] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilterPeople = useCallback(
    debounce((searchName: string) => {
      filterPeople(searchName);
      setCallDropdown(true);
    },
    delay),
    [filterPeople],
  );

  const queryPerson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchName = event.target.value;

    setName(searchName);
    debouncedFilterPeople(searchName);
    setCallDropdown(false);
  };

  const onCut = () => {
    setName('');
    debouncedFilterPeople('');
    setCallDropdown(false);
  };

  const handleSelected = (event: Person) => {
    onSelected(event);
    setName(event.name);
    setCallDropdown(false);
  };

  const handleDropdown = () => {
    setCallDropdown(true);
    filterPeople(name);
  };

  const handleDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (!target.closest('.dropdown')) {
      setCallDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  return (
    <div className="dropdown is-active">

      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={name}
          onKeyDown={() => {}}
          onChange={queryPerson}
          onClick={handleDropdown}
          onCut={onCut}
        />
      </div>

      {callDropdown && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {people.length > 0
              ? (people.map(person => {
                return (
                  <div
                    key={person.name}
                    className="dropdown-item"
                    onClick={() => handleSelected(person)}
                    onKeyDown={() => {}}
                    role="button"
                    tabIndex={0}
                  >
                    <p className={cn('has-text-link',
                      { 'has-text-danger': person.sex === 'f' })}
                    >
                      {person.name}
                    </p>
                  </div>
                );
              }))
              : (
                <div className="dropdown-item has-text-danger">
                  No matching suggestions
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
});
