import classNames from 'classnames';
import debounce from 'lodash.debounce';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const lastFilteredValue = useRef<string | null>(null);
  const selectedPerson = useRef<Person | null>(null);

  const updateSuggestions = useCallback(
    (value: string) => {
      const searchValue = value.trim().toLowerCase();

      if (searchValue === lastFilteredValue.current) {
        setIsDropdownOpen(true);

        return;
      }

      lastFilteredValue.current = searchValue;

      let matchingPeople = people;

      if (searchValue) {
        matchingPeople = people.filter(person =>
          person.name.toLowerCase().includes(searchValue),
        );
      }

      setSuggestions(matchingPeople);
      setIsDropdownOpen(true);
    },
    [people],
  );

  const debouncedUpdateSuggestions = useMemo(
    () => debounce(updateSuggestions, delay),
    [delay, updateSuggestions],
  );

  useEffect(() => {
    return () => debouncedUpdateSuggestions.cancel();
  }, [debouncedUpdateSuggestions]);

  const showSuggestions = (value: string) => {
    const searchValue = value.trim().toLowerCase();

    if (searchValue === lastFilteredValue.current) {
      debouncedUpdateSuggestions.cancel();
      setIsDropdownOpen(true);

      return;
    }

    setIsDropdownOpen(false);
    debouncedUpdateSuggestions(value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (selectedPerson.current) {
      selectedPerson.current = null;
      onSelected(null);
    }

    setInputValue(value);
    showSuggestions(value);
  };

  const handleInputFocus = () => {
    showSuggestions(inputValue);
  };

  const handleSuggestionClick = (person: Person) => {
    debouncedUpdateSuggestions.cancel();
    selectedPerson.current = person;
    setInputValue(person.name);
    setIsDropdownOpen(false);
    onSelected(person);
  };

  const shouldShowNoSuggestions =
    isDropdownOpen && inputValue.trim() !== '' && suggestions.length === 0;

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isDropdownOpen,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            data-cy="search-input"
          />
        </div>

        {isDropdownOpen && suggestions.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {suggestions.map(person => (
                <button
                  type="button"
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => handleSuggestionClick(person)}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {shouldShowNoSuggestions && (
        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
