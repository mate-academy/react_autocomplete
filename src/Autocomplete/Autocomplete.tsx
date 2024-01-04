import cn from 'classnames';
import './Autocomplete.scss';
import React, { useEffect, useState } from 'react';
import { Person } from '../types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person) => void;
  filterPeople: (name: string) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = React.memo((
  {
    people,
    onSelected,
    filterPeople,
  },
) => {
  const [callDropdown, setCallDropdown] = useState(false);
  const [name, setName] = useState('');

  const queryPerson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchName = event.target.value;

    setName(searchName);
    filterPeople(searchName);
  };

  const handleSelected = (event: Person) => {
    onSelected(event);
    setName(event.name);
    setCallDropdown(false);
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
          onClick={() => setCallDropdown(true)}
        />
      </div>

      {callDropdown && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {people.length > 0 ? (people.map(person => {
              return (
                <div
                  key={person.name}
                  className={
                    cn('dropdown-item', { 'is-danger': person.sex === 'f' })
                  }
                  onClick={() => handleSelected(person)}
                  onKeyDown={() => {}}
                  role="button"
                  tabIndex={0}
                >
                  <p className={
                    cn('has-text-link', { 'is-danger': person.sex === 'f' })
                  }
                  >
                    {person.name}
                  </p>
                </div>
              );
            })) : (
              <div className="dropdown-item">
                No matching suggestions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
