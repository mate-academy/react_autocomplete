import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import './App.scss';

import classNames from 'classnames';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

interface AppProps {
  onSelected: (selectedPerson: Person | null) => void;
  debounceDelay: number;
}

const Autocomplete: React.FC<AppProps> = React.memo(
  ({ onSelected, debounceDelay }) => {
    const [inputText, setInputText] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Person[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const filteredSuggestions = useMemo(() => {
      if (!inputText) {
        return peopleFromServer;
      }

      return peopleFromServer.filter((person) => {
        return person.name.toLowerCase().includes(inputText.toLowerCase());
      });
    }, [inputText]);

    const debounce = (func: () => void, delay: number) => {
      let timeoutId: number;

      return () => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(func, delay);
      };
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newText = event.target.value;

      setInputText(newText);
      setSuggestions([]);

      if (!newText) {
        setSuggestions(peopleFromServer);
        setIsDropdownVisible(true);
      } else {
        setIsDropdownVisible(true);
      }
    };

    const handleInputFocus = useCallback(() => {
      if (!inputText) {
        setSuggestions(peopleFromServer);
        setIsDropdownVisible(true);
      }
    }, [inputText]);

    const handleItemClick = (person: Person) => {
      setInputText(person.name);
      setSuggestions([]);
      onSelected(person);
      setIsDropdownVisible(false);
    };

    useEffect(() => {
      const debouncedFilter = debounce(() => {
        setSuggestions(filteredSuggestions);
      }, debounceDelay);

      debouncedFilter();
    }, [filteredSuggestions, debounceDelay]);

    const handleItemKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>,
      person: Person,
    ) => {
      if (event.key === 'Enter') {
        handleItemClick(person);
      }
    };

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

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Autocomplete onSelected={handleSelectedPerson} debounceDelay={300} />
    </main>
  );
};
