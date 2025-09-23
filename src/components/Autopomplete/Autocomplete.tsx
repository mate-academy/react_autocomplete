import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  items: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  items,
  delay = 300,
  onSelected,
}) => {
  //#region State
  const [inputValue, setInputValue] = useState(''); // value that we type in the input
  const [appliedQuery, setAppliedQuery] = useState(''); // value that we use for filtering the array of people
  const [suggestions, setSuggestions] = useState<Person[]>([]); // array of filtered people
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  //#endregion

  //#region Ref
  const timerRef = useRef<number | null>(null);
  const lastAppliedRef = useRef<string>('');
  //#endregion

  //#region UseEffect
  //reset timerRef.current if delay has been changed
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [delay]);

  useEffect(() => {
    const normalizedQuery = appliedQuery.trim().toLowerCase();

    if (lastAppliedRef.current === appliedQuery) {
      // use appliedQuery as its what the user typed
      return;
    }

    lastAppliedRef.current = appliedQuery;

    if (isFocused && normalizedQuery === '') {
      setSuggestions(items);
      // setHighlighted(0);

      return;
    }

    if (normalizedQuery === '') {
      setSuggestions([]);
      // setHighlighted(-1);

      return;
    }

    const newSuggestion = items.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );

    setSuggestions(newSuggestion);

    if (newSuggestion.length > 0 && isOpen) {
      setHighlighted(0);
    } else {
      setHighlighted(-1);
    }
  }, [appliedQuery, isFocused, isOpen, items]);
  //#endregion

  //#region handleChanges
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputValue(value); // change input value immediately
    onSelected(null); // reset any selected person when starting typing in the input
    setIsOpen(true); // make the list visible while operating with input

    //debounce
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setAppliedQuery(value);
    }, delay);
  };

  const handleFocusChange = () => {
    setFocused(true);

    if (inputValue.trim() === '') {
      setSuggestions(items);
      setIsOpen(true);
    }
  };

  const handleBlurChange = () => {
    setFocused(false);
    setIsOpen(false);
  };

  const handlePick = (person: Person) => {
    setInputValue(person.name);
    setIsOpen(false);
    setAppliedQuery(person.name);
    onSelected(person);
  };

  // const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Escape') {
  //     setIsOpen(false);
  //   }
  // };

  //#endregion

  return (
    <div className={cn('dropdown', { 'is-active': isOpen })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocusChange}
          onBlur={handleBlurChange}
          // onKeyDown={handleKeyDown}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {suggestions.map((person, index) => (
            <a
              key={person.slug}
              className={cn('dropdown-item', {
                'is-active': index === highlighted,
              })}
              data-cy="suggestion-item"
              onMouseDown={() => handlePick(person)}
              onMouseEnter={() => setHighlighted(index)}
              // role="option"
              // aria-selected={index === highlighted}
              // id={`opt-${index}`}
            >
              {person.name}
            </a>
          ))}
        </div>
      </div>
      {isOpen && appliedQuery.trim() !== '' && suggestions.length === 0 && (
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
    </div>
  );
};
