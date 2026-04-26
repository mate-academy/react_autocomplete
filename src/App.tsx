import React, { useCallback, useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';
import { Person } from './types/Person';

function debounce(callback: unknown, delay = 300) {
  let timerId: unknown = 0;

  return (...args: unknown[]) => {
    if (typeof timerId === 'number') {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      if (typeof callback === 'function') {
        callback(...args);
      }
    }, delay);
  };
}

export const App: React.FC = () => {
  const [people, setPeople] = useState(peopleFromServer);
  const [selected, onSelected] = useState<Person | null>(null);
  const [showList, setShowList] = useState(false);

  const [value, setValue] = useState('');

  const filterPeople = useCallback(debounce(setPeople), []);

  if (selected && selected.name !== value.trim()) {
    onSelected(null);
  }

  useEffect(() => {
    const filter = peopleFromServer.filter(onePeople => {
      if (onePeople.name.toLowerCase().includes(value.toLowerCase())) {
        return true;
      }
    });

    filterPeople(filter);
  }, [value]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected && selected.name === value
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : `No selected person`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={value}
              data-cy="search-input"
              onFocus={() => setShowList(true)}
              onChange={e => {
                setValue(e.target.value);
              }}
            />
          </div>
          <div>{`${value}, ${selected?.name}`}</div>

          {showList && (
            <Autocomplete
              people={people}
              onNewSelected={prev => onSelected(prev)}
              setNewValue={prev => setValue(prev)}
            />
          )}
        </div>
        {people.length === 0 && !selected ? (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ) : (
          ''
        )}
      </main>
    </div>
  );
};
