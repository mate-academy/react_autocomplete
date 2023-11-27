import { useState } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';
import { useDebounce } from '../customHooks/useDebounce';

type DropdownProps = {
  people: Person[],
  onSelected: (person: Person) => void,
};

export const Dropdown: React.FC<DropdownProps> = ({ people, onSelected }) => {
  const [query, setQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const debouncedQuery = useDebounce(query, 300);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement>
    = (event) => {
      setQuery(event.target.value);
    };

  let filteredPeople = people;

  if (query !== '') {
    filteredPeople = people.filter(person => {
      return person.name.toLowerCase()
        .includes(debouncedQuery.toLowerCase().trim());
    });
  }

  const handleSelectedUser = (person: Person) => {
    onSelected(person);
    setIsFocused(false);
    setQuery(person.name);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </div>
      {isFocused
      && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length === 0
              ? 'No matching suggestions'
              : (
                filteredPeople.map(person => (
                  <div className="dropdown-item" key={person.slug}>
                    <button
                      type="button"
                      onClick={() => handleSelectedUser(person)}
                      className={classNames({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                      style={{
                        background: 'none',
                        color: 'inherit',
                        border: 'none',
                        padding: '0',
                        font: 'inherit',
                        cursor: 'pointer',
                        outline: 'inherit',
                      }}
                    >
                      {person.name}
                    </button>
                  </div>
                )))}
          </div>
        </div>
      )}
    </div>
  );
};
