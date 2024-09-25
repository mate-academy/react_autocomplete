import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';
import { DropdownTrigger } from './DropdownTrigger';
import { DropdownMenu } from './DropdownMenu';
import debounce from 'lodash.debounce';
import { Notification } from './Notification';

type Props = {
  people: Person[];
  query: string;
  delay?: number;
  onSelect: (person: Person) => void;
  onQueryChange: (quary: string) => void;
};

export const Dropdown: React.FC<Props> = React.memo(
  ({ people, query, delay = 300, onSelect, onQueryChange }) => {
    const [isActive, setIsActive] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const filteredPeople = useMemo(() => {
      return people.filter(person => {
        const lowerName = person.name.toLowerCase();
        const lowerQuery = debouncedQuery.toLowerCase();

        return lowerName.includes(lowerQuery);
      });
    }, [debouncedQuery, people]);

    const debouncedQueryChange = useCallback(
      debounce((newQuery: string) => {
        setDebouncedQuery(newQuery);
      }, delay),
      [delay],
    );

    const handleSelect = useCallback(
      (person: Person) => {
        onSelect(person);
        debouncedQueryChange(person.name);
      },
      [onSelect, debouncedQueryChange],
    );

    return (
      <>
        <div
          className={classNames('dropdown', {
            'is-active': isActive && filteredPeople.length,
          })}
        >
          <DropdownTrigger
            query={query}
            onQueryChange={(newQuery: string) => {
              onQueryChange(newQuery);
              debouncedQueryChange(newQuery);
            }}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          />

          <DropdownMenu people={filteredPeople} onSelect={handleSelect} />
        </div>

        <Notification
          message="No matching suggestions"
          visible={!filteredPeople.length}
        />
      </>
    );
  },
);

Dropdown.displayName = 'Dropdown';
