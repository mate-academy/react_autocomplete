import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDownMenu } from './components/DropDownMenu';

function prepareString(str: string) {
  return str.toLowerCase().trim();
}

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [people] = useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState<string>('');
  const [apliedQuery, setApliedQuery] = useState<string>('');

  const applyQuery = useCallback(debounce(setApliedQuery, 1000), []);

  const filteredPeople = useMemo(() => {
    return people.filter(
      ({ name }) => prepareString(name).includes(prepareString(apliedQuery)),
    );
  }, [apliedQuery, people]);

  const queryChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const onSelected = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery('');
    setApliedQuery('');
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {
          selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
            : 'No selected person'
        }
      </h1>

      <div
        className={classNames('dropdown', {
          'is-active': apliedQuery,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={queryChangeHandler}
          />
        </div>

        <DropDownMenu people={filteredPeople} onSelected={onSelected} />
      </div>
    </main>
  );
};
