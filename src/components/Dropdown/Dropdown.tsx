import { Dispatch, SetStateAction, useState } from 'react';
import { Person } from '../../types/Person';
import './Dropdown.scss';

type Props = {
  filteredPeople: Person[];
  selectPerson: Dispatch<SetStateAction<Person | null>>;
  applyQuery: Dispatch<React.SetStateAction<string>>;
  isMatched: boolean;
};

export const Dropdown: React.FC<Props> = ({
  filteredPeople,
  selectPerson,
  applyQuery,
  isMatched,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const handleSelectPerson = (person: Person) => {
    selectPerson(person);
    setIsFocused(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setIsFocused(true);
    setQuery(value);
    applyQuery(value);
    selectPerson(null);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    person: Person,
  ) => {
    if (event.key === 'Enter') {
      handleSelectPerson(person);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 300);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
      </div>

      <div
        className="dropdown-menu dropdown-menu--overflow"
        role="menu"
        data-cy="suggestions-list"
      >
        {isFocused && isMatched && (
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                onClick={() => handleSelectPerson(person)}
                onKeyDown={event => handleKeyDown(event, person)}
                tabIndex={0}
                role="button"
                className="dropdown-item dropdown-item--hover is-clickable"
                data-cy="suggestion-item"
                key={person.slug}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
