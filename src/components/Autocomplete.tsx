import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import classNames from 'classnames';
import { peopleFromServer } from '../data/people';

import { Person } from '../types/Person';

interface AppProps {
  onSelected: (selectedPerson: Person | null) => void;
  debounceDelay: number;
}

export const Autocomplete: React.FC<AppProps> = React.memo(
  ({ onSelected, debounceDelay }) => {
    const [inputText, setInputText] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Person[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [focused, setFocused] = useState(false);

    const filteredSuggestions = useMemo(() => {
      if (!inputText) {
        return peopleFromServer;
      }

      return peopleFromServer.filter((person) => {
        return person.name.toLowerCase().includes(inputText.toLowerCase());
      });
    }, [inputText]);

    const debounce = useCallback((func: () => void, delay: number) => {
      let timeoutId: number;

      return () => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(func, delay);
      };
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newText = event.target.value;

      setInputText(newText);
      setSuggestions([]);

      if (newText === '' && focused) {
        setSuggestions(peopleFromServer);
        setIsDropdownVisible(true);
      } else {
        setIsDropdownVisible(newText !== '');
      }

      if (!newText) {
        onSelected(null);
      }
    };

    const handleInputFocus = useCallback(() => {
      if (!inputText && !isDropdownVisible) {
        setSuggestions(peopleFromServer);
        setIsDropdownVisible(true);
      } else {
        setSuggestions(filteredSuggestions);
        setIsDropdownVisible(true);
      }

      setFocused(true);
    }, [filteredSuggestions, inputText, isDropdownVisible]);

    const handleItemClick = (person: Person) => {
      setInputText(person.name);
      setSuggestions([]);
      onSelected(person);
      setIsDropdownVisible(false);
    };

    useEffect(() => {
      const debouncedFilter = debounce(() => {
        if (inputText === '') {
          setSuggestions(peopleFromServer);
        } else {
          setSuggestions(filteredSuggestions);
        }
      }, debounceDelay);

      debouncedFilter();
    }, [filteredSuggestions, debounceDelay, debounce, inputText]);

    const handleItemKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>,
      person: Person,
    ) => {
      if (event.key === 'Enter') {
        handleItemClick(person);
      }
    };

    const handleInputBlur = useCallback(() => {
      setTimeout(() => {
        setFocused(false);
        setIsDropdownVisible(false);
      }, 200);
    }, []);

    return (
      <div
        className={classNames('dropdown', {
          'is-active': isDropdownVisible,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputText}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {suggestions.length === 0 && inputText && (
              <div className="dropdown-item">
                <p className="has-text-link">No matching suggestions</p>
              </div>
            )}

            {suggestions.map((person) => (
              <div
                className="dropdown-item"
                key={person.name}
                role="button"
                tabIndex={0}
                onClick={() => handleItemClick(person)}
                onKeyDown={(event) => handleItemKeyDown(event, person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);
