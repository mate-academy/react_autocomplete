import React, {
  useState,
  useCallback,
  useMemo,
} from 'react';

import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PersonsList } from './components/PersonsList/PersonsList';

type Props = {
  delay: number;
};

export const App: React.FC<Props> = ({ delay }) => {
  const [query, setQuery] = useState('');
  const [showList, setShowList] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const handleOnBlur = () => {
    setTimeout(() => setShowList(false), 200);
  };

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      item => item.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const person = peopleFromServer.find(item => item.name === query);

  return (
    <main className="section">
      <h1 className="title">
        {(person && `${person.name} (${person.born} = ${person.died})`) || 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            onFocus={() => setShowList(true)}
            onBlur={handleOnBlur}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              applyQuery(event.target.value);
            }}
          />
        </div>

        {showList && (
          <PersonsList
            persons={filteredPeople}
            onSelected={
              (name) => {
                setQuery(name);
                setAppliedQuery(name);
              }
            }
          />
        )}
      </div>
    </main>
  );
};
