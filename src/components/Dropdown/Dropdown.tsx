import React, { useCallback, useMemo, useState } from 'react';
import './Dropdown.scss';
import cn from 'classnames';
import { debounce } from 'lodash';
import { Person } from '../../types/Person';
import { DropdownTrigger } from './DropdownTrigger';
import { DropdownMenu } from './DropdownMenu';

type Props = {
  people: Person[];
  setSelectedPerson: (person: Person | null) => void;
  delay: number;

};

export const Dropdown: React.FC<Props> = React.memo(
  (
    {
      people,
      setSelectedPerson,
      delay,

    },
  ) => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const applyDebouncedQuery = useCallback(
      debounce(setDebouncedQuery, delay),
      [],
    );

    const visiblePeople: Person[] = useMemo(() => (
      people.filter(
        ({ name }) => name.toLowerCase().includes(debouncedQuery.toLowerCase()),
      )
    ), [debouncedQuery]);

    const handleQueryChange = useCallback((newQuery: string) => {
      setSelectedPerson(null);
      setQuery(newQuery);
      applyDebouncedQuery(newQuery.trim());
    }, [debouncedQuery]);

    const handlePersonClick = useCallback((person: Person) => {
      setSelectedPerson(person);
      setQuery(person.name);
      setDebouncedQuery('');
    }, []);

    const handleResetQuery = useCallback(() => {
      setSelectedPerson(null);
      setQuery('');
      setDebouncedQuery('');
    }, []);

    return (
      <div className={
        cn(
          'dropdown',
          { 'is-active': !!debouncedQuery },
        )
      }
      >

        <DropdownTrigger
          query={query}
          handleQueryChange={handleQueryChange}
          handleResetQuery={handleResetQuery}
        />

        <DropdownMenu
          visiblePeople={visiblePeople}
          handlePersonClick={handlePersonClick}
        />

      </div>
    );
  },
);
