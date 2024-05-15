import { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import { Person } from './types/Person';

export const App: React.FC<Person> = () => {
  const [query, setQuery] = useState('');
  // const [title, setTitle] = useState('No selected person');
  const [selectedPeople, setSelectedPeople] = useState<Person | ''>('');
  const [showAllPeople, setShowAllPeople] = useState(false);

  const filteredPersons = peopleFromServer.filter(person => person.name.includes(query));

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleOnClick = (person: Person) => {
    setSelectedPeople(person);
    setQuery('');
  };

  const handleOnFocus = () => {
    if (!query) {
      setShowAllPeople(true);
    };
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPeople
            ? `${selectedPeople.name} (${selectedPeople.born} - ${selectedPeople.died})`
            : 'No selected person'
            }
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleOnChange}
              onFocus={handleOnFocus}
            />
          </div>

          {(query || showAllPeople) && (<div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPersons.map(person => (
                  <div className={classNames('dropdown-item', {
                    'is-active': person === selectedPeople
                  })}
                    key={person.name}
                    data-cy="suggestion-item"
                  onClick={() => handleOnClick(person)}
                  >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger' : person.sex === 'f'
                    })}
                    >
                    {person.name}
                    </p>
                  </div>
                ))
              }
            </div>
          </div>
          )}
        </div>

        {(query && filteredPersons.length === 0) && (<div
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
        </div>)
        }
      </main>
    </div>
  );
};
