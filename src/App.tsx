import React, { useCallback, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const appliedQueryNorm = appliedQuery.trim().toLowerCase();

  const visiblePeople = React.useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQueryNorm),
    );
  }, [appliedQuery, peopleFromServer]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event?.target.value);
    applyQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {`${name} (${born} = ${died})`}
      </h1>

      <div className={cn('dropdown', {
        'is-active': appliedQueryNorm,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>
      </div>
      <Dropdown
        visiblePeople={visiblePeople}
      />
    </main>
  );
};
