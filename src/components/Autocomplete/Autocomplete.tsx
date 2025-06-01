import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import { Person } from '../../types/Person';
import { getFilteredPeople } from '../../utils/getFilteredPeople';
import { SuggestionList } from '../SuggestionList/';
import { NoSuggestionsMessage } from '../NoSuggestionsMessage/';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  selectedPerson: Person | null;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  selectedPerson,
  delay = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (selectedPerson) {
      setInputValue(selectedPerson.name);
      setQuery(selectedPerson.name.toLowerCase());
    } else {
      setInputValue('');
      setQuery('');
    }
  }, [selectedPerson]);

  const debouncedSetQuery = useMemo(() => debounce(setQuery, delay), [delay]);

  const filteredPeople = useMemo(() => {
    return getFilteredPeople(query, people);
  }, [query, people]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setIsFocused(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const clearSelection = useCallback(() => {
    onSelected(null);
    setQuery('');
  }, [onSelected]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim().toLowerCase();

      setInputValue(value);
      setIsFocused(true);

      if (selectedPerson) {
        clearSelection();
      }

      if (value === '') {
        debouncedSetQuery.cancel();
        setQuery('');
      } else {
        debouncedSetQuery(value);
      }
    },
    [selectedPerson, clearSelection, debouncedSetQuery],
  );

  const handleClickSelectPerson = useCallback(
    (person: Person) => {
      onSelected(person);
      setIsFocused(false);
      setInputValue(person.name);
      setQuery(person.name.toLowerCase());
    },
    [onSelected],
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  return (
    <div
      className={cn('dropdown', {
        'is-active': isFocused && filteredPeople.length > 0,
      })}
      ref={wrapperRef}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          id="autocomplete-input"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-expanded={isFocused}
        />
      </div>

      {isFocused && filteredPeople.length > 0 && (
        <SuggestionList
          people={filteredPeople}
          onSelectPerson={handleClickSelectPerson}
        />
      )}

      {isFocused && query && filteredPeople.length === 0 && (
        <NoSuggestionsMessage />
      )}
    </div>
  );
};
