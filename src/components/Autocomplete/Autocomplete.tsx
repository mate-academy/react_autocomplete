import { FC, useState, useEffect } from 'react';
import cn from 'classnames';
import { debounce } from '../../helper';
import { Person } from '../../types/Person';
import './Autocomplete.scss';

type Props = {
  options: Person[],
  getValue: (value: Person) => void;
};

const getCurrentOptions = (options: Person[], query: string): Person[] | [] => {
  if (query) {
    return options.filter(({ name }) => {
      return name.toLowerCase().includes(query.toLowerCase());
    });
  }

  return [...options];
};

export const Autocomplete: FC<Props> = ({ options, getValue }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const currentOptions = getCurrentOptions(options, searchQuery);

  useEffect(() => {
    getValue(currentOptions.find(({ name }) => {
      return name === currentValue;
    }) as Person);
  }, [currentValue]);

  const debouncedSearchQuery = debounce<string>((arg) => {
    setSearchQuery(arg);
  }, 1000);

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setCurrentValue(value);
    debouncedSearchQuery(value);
  };

  const handleInputOnBlur = () => {
    setTimeout(() => setShowMenu(false), 200);
  };

  const handleSelectedValue = (value: string) => {
    setCurrentValue(value);

    setShowMenu(false);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="search"
          placeholder="Enter the name"
          className="input"
          value={currentValue}
          onChange={handleInputOnChange}
          onClick={() => setShowMenu(prevShowMenu => !prevShowMenu)}
          onBlur={handleInputOnBlur}
        />
      </div>

      {showMenu && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content scroll-container">
            {currentOptions.length > 0
              && currentOptions.map(({ name }) => (
                <button
                  type="button"
                  className="dropdown-item button is-white"
                  key={name}
                  onClick={() => handleSelectedValue(name)}
                >
                  <p
                    className={cn({
                      'has-text-link': currentValue !== name,
                      'has-text-danger': currentValue === name,
                    })}
                  >
                    {name}
                  </p>
                </button>
              ))}

            {currentOptions.length === 0 && (
              <p className="has-text-grey dropdown-item">
                No matching suggestions
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
