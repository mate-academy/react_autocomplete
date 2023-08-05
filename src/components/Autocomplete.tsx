import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';

import { Person } from '../types/Person';

function getVisibleOptions(people: Person[], query: string) {
  let visiblePeople = [...people];

  if (query) {
    const preparedQuery = query.trim().toLowerCase();

    visiblePeople = visiblePeople.filter((person) => {
      const { name } = person;

      return name.toLowerCase().includes(preparedQuery);
    });
  }

  return visiblePeople;
}

type AutocompleteProps = {
  options: Person[];
  setSelectedOption?: React.Dispatch<React.SetStateAction<Person | null>>
  delayAutocopmlete?: number;
};

export const Autocopmlete: React.FC<AutocompleteProps> = ({
  options,
  setSelectedOption: setCelectedOption = () => {},
  delayAutocopmlete = 1000,
}) => {
  // #region state
  const [isOpen, setIsOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(0);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delayAutocopmlete),
    [],
  );

  const debouncedIsOpen = useCallback(
    debounce(setIsOpen, delayAutocopmlete),
    [],
  );
  // #endregion

  const visibleOptions = useMemo(() => {
    return getVisibleOptions(options, appliedQuery);
  }, [appliedQuery]);

  const toggle = (e: Event) => {
    const target = e.target as Element;

    if (target.id === 'input-trigger') {
      setIsOpen(prevIsOpen => !prevIsOpen);

      return;
    }

    setIsOpen(false);
  };

  useEffect(() => {
    window.addEventListener('click', toggle);

    return () => window.removeEventListener('click', toggle);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    applyQuery(e.target.value);
    debouncedIsOpen(true);
    setIsOpen(false);
  };

  const handleOptionChange = (person: Person) => {
    setCelectedOption(person);
    setIsOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Escape':
        setIsOpen(false);

        break;
      case 'Enter':
        setCelectedOption(visibleOptions[activeOption]);
        setIsOpen(false);

        break;
      case 'ArrowUp':
        if (activeOption !== 0) {
          setActiveOption(activeOption - 1);
        }

        break;
      case 'ArrowDown':
        if (activeOption - 1 !== visibleOptions.length) {
          setActiveOption(activeOption + 1);
        }

        break;
      default:
        break;
    }
  };

  window.console.log('Render Autocopmlete');

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          id="input-trigger"
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleTextChange}
          onClick={() => toggle}
          onKeyDown={onKeyDown}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {!visibleOptions.length && (
              <div className="dropdown-item massage">
                No matching suggestions
              </div>
            )}

            {visibleOptions.map((option, index) => (
              <div
                key={option.name}
                className={cn(
                  'dropdown-item',
                  { active: index === activeOption },
                )}
                role="button"
                tabIndex={index}
                onClick={() => handleOptionChange(option)}
                onKeyDown={() => onKeyDown}
              >
                <p>
                  {option.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
