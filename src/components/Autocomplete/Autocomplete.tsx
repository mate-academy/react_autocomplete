import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { AutocompleteInput } from '../AutocompleteInput';
import { AutocompleteList } from '../AutocompleteList';
import { Alert } from '../Alert';
import { Nullable } from '../../types/Nullable';
import { Person } from '../../types/Person';

const filterPeople = (people: Person[], query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery !== '') {
    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }

  return people;
};

interface Props {
  people: Person[];
  onSelected: (person: Nullable<Person>) => void;
  delay?: number;
}

export const Autocomplete = ({ people, onSelected, delay = 300 }: Props) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const applyQuery = useRef(
    debounce((value: string) => setAppliedQuery(value), delay),
  ).current;

  useEffect(() => () => applyQuery.cancel(), [applyQuery]);

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trimStart().replace(/\s+/g, ' ');

      setQuery(value);
      applyQuery.cancel();
      applyQuery(value);
      onSelected(null);
    },
    [applyQuery, onSelected],
  );

  const handlePersonSelect = useCallback(
    (person: Person) => {
      setQuery(person.name);
      setAppliedQuery(person.name);
      setIsOpen(false);
      onSelected(person);
    },
    [onSelected],
  );

  const handleFocus = useCallback(() => setIsOpen(true), []);
  const handleBlur = useCallback(() => setIsOpen(false), []);

  const filteredPeople = useMemo(
    () => filterPeople(people, appliedQuery),
    [people, appliedQuery],
  );

  return (
    <div className={classNames('dropdown', { 'is-active': isOpen })}>
      <AutocompleteInput
        query={query}
        onQueryChange={handleQueryChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isOpen &&
        (filteredPeople.length > 0 ? (
          <AutocompleteList
            people={filteredPeople}
            onSelected={handlePersonSelect}
          />
        ) : (
          <Alert message="No matching suggestions" />
        ))}
    </div>
  );
};
