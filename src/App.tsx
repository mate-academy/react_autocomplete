import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import debounce from 'lodash.debounce';
import classNames from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { Dropdown } from './components/dropdown';

export const App: React.FC = () => {
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selected, setSelected] = useState<'' | Person>('');
  const inputRef: React.RefObject<HTMLInputElement> | null = useRef(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleSelect = (person: Person) => {
    setSelected(person);
    setAppliedQuery('');

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handlerQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selected ? (
          `${selected.name} (${selected.born} - ${selected.died})`
        ) : 'No selected person'}
      </h1>

      <div className={classNames('dropdown', { 'is-active': appliedQuery })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            ref={inputRef}
            onChange={handlerQueryChange}
          />
        </div>

        {appliedQuery && (
          <Dropdown
            people={filteredPeople}
            onSelect={handleSelect}
          />
        )}
      </div>
    </main>
  );
};
