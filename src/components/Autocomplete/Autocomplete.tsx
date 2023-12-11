import React, { useCallback, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import { Input } from './Input/Input';
import { Dropdown } from './Dropdown/Dropdown';
import { filterPeople } from '../../helpers';

interface Props {
  peopleFromServer: Person[],
  delay?: number,
}

export const Autocomplete: React.FC<Props> = (
  {
    peopleFromServer,
    delay = 1000,
  },
) => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const [
    selectedPerson,
    setSelectedPerson,
  ] = useState<Person | null>(null);

  const onApplyQuery = (qry: string) => {
    setAppliedQuery(qry);
    setIsDropdownShown(true);
  };

  const applyQuery = useCallback(debounce(onApplyQuery, delay), []);

  const handleFocusInput = () => {
    if (!isDropdownShown) {
      setIsDropdownShown(true);
    }
  };

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsDropdownShown(false);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return filterPeople(peopleFromServer, appliedQuery);
  }, [appliedQuery, peopleFromServer]);

  const onSelected = (
    event: React.MouseEvent<HTMLAnchorElement>,
    personSlug: string,
  ) => {
    event.preventDefault();

    setSelectedPerson(
      peopleFromServer.find((person) => person.slug === personSlug) || null,
    );

    if (!event.currentTarget.textContent) {
      setQuery('');

      return;
    }

    setQuery(event.currentTarget.textContent);

    setIsDropdownShown(false);
  };

  return (
    <>
      {
        selectedPerson
          ? (
            <h1 className="title">
              {`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
            </h1>
          )
          : (
            <h1 className="title">
              No selected person
            </h1>
          )
      }

      <div className="dropdown is-active">
        <Input
          query={query}
          onChange={handleQueryChange}
          onFocus={handleFocusInput}
        />

        {
          (isDropdownShown && !!filterPeople.length)

          && (
            <Dropdown
              people={filteredPeople}
              onSelect={onSelected}
            />
          )
        }
      </div>
    </>
  );
};
