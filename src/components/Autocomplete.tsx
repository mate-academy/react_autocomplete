import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import { debounce } from 'lodash';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';
import { DropdownList } from './DropdownList';

type Props = {
  delay: number,
};

export const Autocomplete: React.FC<Props> = ({ delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const filteredPeople = useMemo(() => {
    const normalisedQuery = query.toLocaleLowerCase();

    return peopleFromServer.filter(person => (
      person.name.toLocaleLowerCase().includes(normalisedQuery)
    ));
  }, [appliedQuery, peopleFromServer]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const selectPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setAppliedQuery('');
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', {
        'is-active': appliedQuery || isFocused,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">

          <DropdownList
            people={filteredPeople}
            isFocused={isFocused}
            onSelect={selectPerson}
          />
        </div>
      </div>
    </main>
  );
};
