import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';

type Props = {
  delay?: number;
  onSelected?: (person: Person | null) => void;
};

export const App: React.FC<Props> = () => {
  const [targetPerson, setTargetPerson] = useState<Person | null>();
  const [currentTodos, setCurrentTodos] = useState(peopleFromServer);
  const [inputSort, setInputSort] = useState<string>('');
  const [appliedInputSort, setAppliedInputSort] = useState('');

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSort(event.target.value);
    if (inputSort.length > 0) {
      setCurrentTodos(
        currentTodos.filter(person =>
          person.name
            .toLocaleLowerCase()
            .includes(appliedInputSort.trim().toLocaleLowerCase()),
        ),
      );
    } else {
      setCurrentTodos(peopleFromServer);
    }
  };

  useEffect(() => {
    const handler = debounce(() => setAppliedInputSort(inputSort), 300);

    handler();

    return () => handler.cancel();
  }, [inputSort]);

  const todos = currentTodos.map(item => (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      key={item.slug}
      onClick={() => {
        setTargetPerson(item);
        setInputSort('');
        setCurrentTodos(peopleFromServer);
      }}
    >
      <p className={cn('has-text-link')}>({item.name})</p>
    </div>
  ));

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {targetPerson
            ? `${targetPerson?.name} (${targetPerson?.born} - ${targetPerson?.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputSort}
              onChange={handleChangeInput}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content"> {todos} </div>
          </div>
        </div>
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
          {currentTodos.length && inputSort && (
            <p className="has-text-danger">No matching suggestions</p>
          )}
        </div>
      </main>
    </div>
  );
};
