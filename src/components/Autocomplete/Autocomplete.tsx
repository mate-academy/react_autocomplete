import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import { PeopleList } from '../PeopleList';

type FilterParams = {
  query: string;
};

function filterPeople(people: Person[], { query }: FilterParams): Person[] {
  let resultPeople = [...people];
  const normalazidQuery = query.toLowerCase();

  if (query) {
    resultPeople = resultPeople.filter((person) => {
      const normalazidName = person.name.toLowerCase();

      return normalazidName.includes(normalazidQuery);
    });
  }

  return resultPeople;
}

interface Props {
  people: Person[],
  selectedPerson: Person | null,
  setSelectedPerson: (person: Person | null) => void,
  sugestionDelay: number,
}

export const Autocomplete: React.FC<Props> = ({
  people,
  selectedPerson,
  setSelectedPerson,
  sugestionDelay,
}) => {
  const [query, setQuery] = useState('');
  const [preparedQuery, setPreparedQueary] = useState('');
  const setQueryToFilter = useCallback(
    debounce(setPreparedQueary, sugestionDelay),
    [],
  );

  const visiblePeople = useMemo(
    () => filterPeople(people, { query: preparedQuery }),
    [preparedQuery],
  );

  function handleOnChange(newQuery: string): void {
    setQuery(newQuery);
    setQueryToFilter(newQuery);
    setSelectedPerson(null);
  }

  const handleOnSelect = (person: Person): void => {
    setSelectedPerson(person);

    setQuery(person.name.toString());
  };

  const isToShowSugestion = preparedQuery
  && selectedPerson === null
  && query === preparedQuery;

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={(event) => handleOnChange(event.currentTarget.value)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {isToShowSugestion
        && (visiblePeople.length > 0
          ? (
            <PeopleList
              people={visiblePeople}
              // eslint-disable-next-line react/jsx-no-bind
              onSelected={handleOnSelect}
            />
          ) : 'No matching suggestions')}
      </div>
    </div>
  );
};
