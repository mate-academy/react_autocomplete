import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { FilteringList } from './components/FilteringList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [applyQuery, setApplyQuery] = useState('');
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);

  const filteredList = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().replaceAll(' ', '')
        .includes(applyQuery.toLowerCase()),
    );
  }, [peopleFromServer, applyQuery]);

  const applyedQuery = useCallback(debounce(setApplyQuery, 1000), []);

  return (
    <main className="section">
      {selectPerson ? (
        <h1 className="title">
          {`${selectPerson.name} (${selectPerson.born} = ${selectPerson.died})`}
        </h1>
      ) : (
        <h1 className="title">No selected person</h1>
      )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setApplyQuery('');
              applyedQuery(e.target.value);
            }}
          />
        </div>

        {(applyQuery.length !== 0) && (
          <FilteringList
            list={filteredList}
            setSelectPerson={setSelectPerson}
            setApplyQuery={setApplyQuery}
          />
        )}
      </div>
    </main>
  );
};
