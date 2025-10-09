import React, { useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

interface Props {
  delay: number;
  query: string;
  setMenuVisability: (value: boolean) => void;
  setQuery: (value: string) => void;
  setFilteredPeople: (people: Person[]) => void;
  peopleFromServer: Person[];
}

export const Autocomplete: React.FC<Props> = ({
  delay,
  query,
  setMenuVisability,
  setQuery,
  setFilteredPeople,
  peopleFromServer,
}) => {
  const lastFilteredRef = useRef<string>('');

  const handleQuery = useMemo(
    () =>
      debounce((value: string) => {
        const normalizedValue = value.toLocaleLowerCase().trim();

        if (normalizedValue === lastFilteredRef.current) {
          return;
        }

        lastFilteredRef.current = normalizedValue;

        setFilteredPeople(
          peopleFromServer.filter(person =>
            person.name.toLowerCase().includes(value.toLowerCase()),
          ),
        );
      }, delay),

    [delay, setFilteredPeople, peopleFromServer],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    handleQuery(value);
    // setSelected(null);
  };

  return (
    <input
      onFocus={() => setMenuVisability(true)}
      value={query}
      type="text"
      placeholder="Enter a part of the name"
      className="input"
      data-cy="search-input"
      onChange={event => handleChange(event)}
    />
  );
};
