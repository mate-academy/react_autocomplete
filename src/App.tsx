import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

function debounce(callback: Function, delay: number) {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

type Props = {
  appliedQuary: string,
}

function getFilteredPeople(
  people: Person[], { appliedQuary }: Props,
): Person[] {
  const copiedPeople = [...people];

  if (appliedQuary) {
    const normalizedQuary = appliedQuary.toLowerCase().trim();

    return copiedPeople.filter(
      person => person.name.toLowerCase().includes(normalizedQuary) || null,
    );
  }

  return people;
}

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  const [query, setQuery] = useState<string>('');
  const [appliedQuary, setAppliedQuary] = useState('');
  const [userId, setUserId] = useState('');
  const [touched, setTouched] = useState(false);
  const [findedPerson, setFindedPerson] = useState<Person | null>(null);

  const filteredPeople = useMemo(() => {
    const filterePeople = getFilteredPeople(
      peopleFromServer, { appliedQuary },
    );

    setTouched(true);

    return filterePeople;
  }, [appliedQuary, peopleFromServer]);

  const applyQuary = useCallback(
    debounce(setAppliedQuary, 1000),
    [],
  );

  const handleQuaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuary(event.target.value);
    setTouched(false);
  };

  function getPersonBySlug(id: string) {
    const foundPerson = filteredPeople.find(
      person => person.slug === id,
    ) || null;

    return foundPerson;
  }

  const handleOnMouseDown = (slug: string) => {
    const foundPerson = getPersonBySlug(slug);

    setUserId(slug);
    setFindedPerson(foundPerson);
    setQuery(foundPerson?.name || '');
    setAppliedQuary(foundPerson?.name || '');
  };

  return (
    <main className="section">
      {userId
        ? (
          <h1 className="title">
            {`${findedPerson?.name} (${findedPerson?.born} - ${findedPerson?.died})`}
          </h1>
        )
        : (
          <p>No selected person</p>
        )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleQuaryChange}
            onFocus={() => setTouched(true)}
            onBlur={() => setTouched(false)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {touched && (
              filteredPeople.map(person => (
                <div className="dropdown-item" key={person.slug}>
                  <button
                    type="button"
                    className="has-text-link"
                    onMouseDown={() => handleOnMouseDown(person.slug)}
                  >
                    {person.name}
                  </button>
                </div>
              ))
            )}

            {filteredPeople.length === 0 && (<p>No matching suggestions</p>)}
          </div>
        </div>
      </div>
    </main>
  );
};
