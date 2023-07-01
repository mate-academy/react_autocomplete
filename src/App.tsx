import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { List } from './components/List';
import { castomDebounce } from './utils/CastomDebounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [applyQuery, setApplyQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState({
    ...peopleFromServer[0],
    name: 'No selected person',
  });
  const { name, born, died } = selectedPerson;
  const debounceDelay = 1000;
  const applyedQuery = castomDebounce(setApplyQuery, debounceDelay);

  const visiblePeopleFn = () => {
    if (applyQuery === '') {
      return [];
    }

    const peoples = peopleFromServer.filter(el => (
      el.name.toLocaleLowerCase()
        .includes(applyQuery.toLocaleLowerCase().trim())
    ));

    if (peoples.length === 0) {
      return [{
        ...peopleFromServer[0],
        name: 'No matching suggestions',
        sex: 'no',
      }];
    }

    return peoples;
  };

  const visiblePeople = visiblePeopleFn();
  const handlerClick = (persone: Person) => {
    setSelectedPerson(persone);
    setQuery(persone.name);
    setApplyQuery('');
  };

  return (
    <main className="section">
      <h1 className="title">
        {name === 'No selected person' ? name : `${name} (${born} = ${died})`}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              applyedQuery(e.target.value);
            }}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <List
            visiblePeople={visiblePeople}
            onClickHandler={handlerClick}
          />
        </div>
      </div>
    </main>
  );
};
