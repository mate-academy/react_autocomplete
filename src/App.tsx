import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [people, setPeople] = useState(peopleFromServer);
  const [searchedPerson, setsearchedPerson] = useState<string>('');
  const [isSearched, setIsSearched] = useState<boolean>(true);
  const [onSelected, setOnSelected] = useState<Person>({
    name: '',
    born: 0,
    died: 0,
    sex: 'm',
    fatherName: null,
    motherName: null,
    slug: '',
  });

  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setsearchedPerson(event.target.value);
    setIsSearched(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filteredPeople = peopleFromServer.filter(person => {
        return person.name.toLowerCase().includes(searchedPerson.toLowerCase());
      });

      setIsSearched(true);
      setPeople(filteredPeople);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchedPerson]);

  return (
    <main className="section">
      <h1 className="title">
        {onSelected && onSelected.name
          ? `${onSelected.name} (${onSelected.born} - ${onSelected.died})`
          : 'Select Person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={searchedPerson}
            onChange={(event) => handleSelectionChange(event)}
          />
        </div>

        {isSearched && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {people.map(person => (
                <div className="dropdown-item" key={person.slug}>
                  { /* eslint-disable-next-line */}
                  <p
                    className={`${person.sex === 'm' ? 'has-text-link' : 'has-text-danger'} cursor`}
                    onClick={() => setOnSelected(person)}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
              {!people.length && 'No matching suggestions'}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
