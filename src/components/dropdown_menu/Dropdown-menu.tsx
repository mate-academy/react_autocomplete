import { Person } from '../../types/Person';
import { useCallback, useState } from 'react';

type Props = {
  filterPeople: Person[];
  query: string;
  handleQueryChange: React.ChangeEventHandler<HTMLInputElement>;
  delay?: number;
};

export const Dropdown: React.FC<Props> = ({
  filterPeople,
  query,
  handleQueryChange,
  delay = 300,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setIsOpen(false);
  };

  const debounce = useCallback(
    (callback: (...args: React.ChangeEvent<HTMLInputElement>[]) => void) => {
      let timerId = 0;

      return (...args: React.ChangeEvent<HTMLInputElement>[]) => {
        window.clearTimeout(timerId);

        timerId = window.setTimeout(() => {
          callback(...args);
        }, delay);
      };
    },
    [delay],
  );

  const handleDebounce = debounce(handleQueryChange);

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
