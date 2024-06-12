import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

function filterPeople(arr: Person[], query: string) {
  return arr.filter((person: Person) =>
    person.name.toLowerCase().includes(query.toLowerCase().trim()),
  );
}

export const App: React.FC = () => {
  // const { name, born, died } = peopleFromServer[0];
  // const [selectedPerson, setSelectedPerson] =
  //   useState<React.ReactNode>('No selected person');

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // console.log(selectedPerson);

  const [query, setQuery] = useState('');

  const [showDropdown, setShowDropdown] = useState(false);

  const filteredPeople = filterPeople(peopleFromServer, query);

  const handleChoose = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();

    setSelectedPerson(person);
  };

  // const onSelected = (person: Person) => {
  //   setSelectedPerson(`${person.name} (${person.born} - ${person.died})`);
  // };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson ? selectedPerson.name : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={event => setQuery(event.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setShowDropdown(false)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {showDropdown && (
              <div className="dropdown-content">
                <div data-cy="suggestion-item">
                  {filteredPeople.length > 0 ? (
                    filteredPeople.map((person: Person) => (
                      <a
                        href="#"
                        key={person.slug}
                        className="dropdown-item"
                        onClick={event => handleChoose(event, person)}
                      >
                        {person.name}
                      </a>
                      // <hr className="dropdown-divider" />
                    ))
                  ) : (
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
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* <div
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
        </div> */}
      </main>
    </div>
  );
};
