import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { NoMatching } from './components/NoMatching';

const filterPeople = (people: Person[], qvery: string) => {
  return people.filter(person => (
    person.name
      .toLowerCase()
      .includes(qvery.toLowerCase())));
};

const debounce = (f: (str: string) => void, delay: number) => {
  let timerId = 0;

  return (str: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      f(str);
    }, delay);
  };
};

export const App: React.FC = () => {
  const [person, setPerson] = useState<Person | null>();
  const [query, setQuery] = useState('');

  const visiblPeople = useMemo(() => {
    return filterPeople(peopleFromServer, query);
  }, [query]);

  const applyQuery = useCallback(
    debounce(setQuery, 300),
    [],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1
          className="title"
          data-cy="title"
          id="title"
        >
          {person
            ? `${person.name} (${person.born} - ${person.died})`
            : 'No selected person'}
        </h1>

        <Dropdown
          setPerson={setPerson}
          visiblePeople={visiblPeople}
          setQuery={setQuery}
          applyQuery={applyQuery}
        />

        {visiblPeople.length === 0
          && <NoMatching />}
      </main>
    </div>
  );
};
