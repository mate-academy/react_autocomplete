import debounce from 'lodash.debounce';
import cn from 'classnames';

import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';
import { AutocompleteList } from '../AutocompleteList/AutocompleteList';

type Props = {
  delay: number,
  onSelected: (person: Person) => void,
};

export const DropMenu: React.FC<Props> = ({
  delay,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isHidingSuggestions, setIsHidingSuggestions] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isHidingSuggestions) {
      timer = setTimeout(() => {
        setIsHidingSuggestions(false);
      }, delay * 1.5);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isHidingSuggestions]);

  const suggestedPeople = useMemo(() => {
    if (query === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person => person.name.toLowerCase()
      .includes(query.toLowerCase()));
  }, [query, peopleFromServer]);

  const applyQuery = useCallback(debounce(setQuery, delay), []);

  const handleInputTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    const textFromInput = event.target.value;

    setInputValue(textFromInput);
    applyQuery(textFromInput);

    setIsHidingSuggestions(true);
  };

  const handleSelect = useCallback((person: Person) => {
    onSelected(person);
    setInputValue(person.name);
    setQuery(person.name);
  }, []);

  return (
    <div className={cn('dropdown', {
      'is-active': isInputFocused,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputValue}
          onChange={handleInputTyping}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
      </div>

      {(suggestedPeople.length > 0 && !isHidingSuggestions) && (
        <div className="dropdown-menu">
          <div className="dropdown-content">
            <AutocompleteList
              suggestedPeople={suggestedPeople}
              handleSelect={handleSelect}
            />
          </div>
        </div>
      )}

      {suggestedPeople.length < 1 && (
        <div>
          No matching suggestions
        </div>
      )}
    </div>
  );
};
