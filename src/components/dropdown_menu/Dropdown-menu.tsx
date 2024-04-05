import { Person } from '../../types/Person';
import { useState } from 'react';

type Props = {
  filterPeople: Person[];
  query: string;
  handleQueryChange: React.ChangeEventHandler<HTMLInputElement>;
  delay?: number;
  debounce: (
    callback: (...args: React.ChangeEvent<HTMLInputElement>[]) => void,
    delay: number,
  ) => () => void;
};

export const Dropdown: React.FC<Props> = ({
  filterPeople,
  query,
  handleQueryChange,
  debounce,
  //delay = 300,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setIsOpen(false);
  };

  const handleDebounce = debounce(handleQueryChange, 1000);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          value={query}
          onChange={handleDebounce}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
      </div>
      {isOpen && (
        <div className="dropdown-menu" id="dropdown-menu2" role="menu">
          <div className="dropdown-content">
            <div className="dropdown-item">
              {filterPeople.map(person => (
                <p key={person.born}>{person.name} </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
