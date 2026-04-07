//.. Autocomplete
import debounce from 'lodash.debounce';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from './Input';
import { List } from './List';
import type { Person } from '../types/Person';
import { NoSuggestions } from './NoSuggestions';
import { peopleFromServer } from '../data/people';

interface AutocompleteProps {
  delay?: number;
  setSelectedPerson: (person: Person | null) => void;
}

export const Autocomplete = ({
  delay = 300,
  setSelectedPerson,
}: AutocompleteProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(''); // стан для інпута
  const [query, setQuery] = useState(''); // стан для debounce
  const debouncedSetQuery = useMemo(() => {
    return debounce((valueInp: string) => {
      setQuery(valueInp);
    }, delay);
  }, [delay]);

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setValue(newValue);
    debouncedSetQuery(newValue);
    setSelectedPerson(null);
  };

  const getFilteredPeople = (valueInp: string): Person[] => {
    const normalizedValue = valueInp.trim();

    if (!normalizedValue) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(el =>
      el.name.toLowerCase().includes(normalizedValue.toLowerCase()),
    );
  };

  const result = getFilteredPeople(query);

  // .. для вставки у інпут значення
  const handleSelect = (person: Person) => {
    setValue(person.name); // вставляємо в input
    // setQuery(person.name); // щоб debounce не лагав
    setIsFocused(false); // закриваємо список
    setSelectedPerson(person); // щоб отримати юзера у н1
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="dropdown is-active">
        <Input value={value} onChange={handleInput} onFocus={handleFocus} />
        {isFocused && (
          <>
            {query === '' && (
              <List result={peopleFromServer} onSelect={handleSelect} />
            )}

            {query !== '' && result.length > 0 && (
              <List result={result} onSelect={handleSelect} />
            )}

            {query !== '' && result.length === 0 && <NoSuggestions />}
          </>
        )}
      </div>
    </>
  );
};
