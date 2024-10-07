import cn from 'classnames';
import { Person } from '../types/Person';
import { useRef, useState } from 'react';
import '../App.scss';

interface Props {
  query: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filteredPeople: Person[];
  onSelected: (person: Person) => void;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const Dropdown: React.FC<Props> = ({
  query,
  onInputChange,
  filteredPeople,
  onSelected,
  setQuery,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleUnfocus = () => {
    setIsInputFocused(false);
  };

  const handleSelectAndFocus = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    handleUnfocus();
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          ref={inputRef}
          onBlur={handleUnfocus}
          onFocus={handleFocus}
          type="search"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query.trimStart()}
          onChange={onInputChange}
        />
      </div>

      {isInputFocused && !!filteredPeople.length && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                onMouseDown={() => handleSelectAndFocus(person)}
                key={Date.now()}
                className="dropdown-item hovered"
                data-cy="suggestion-item"
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
