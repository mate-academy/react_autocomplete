import React, { useMemo, useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

import { SearchInput } from './components/searchInput/searchInput';
import Content from './components/content/content';

export const App: React.FC = () => {
  const [delay, setDelay] = useState(300); // for change add setDelay

  const [fullField, setFullField] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [focus, setFocus] = useState(false);

  const people = useMemo(() => {
    return [...peopleFromServer];
  }, []);

  const peopleSearcher = useMemo(() => {
    return people.filter(person => person.name.includes(fullField));
  }, [people, fullField]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={classNames(`dropdown`, { 'is-active': focus })}>
          <SearchInput
            delay={delay}
            setFullField={setFullField}
            setSelectedPerson={setSelectedPerson}
            selectedPerson={selectedPerson}
            setFocus={setFocus}
            setDelay={setDelay}
          />

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <Content
              peopleFromServer={peopleSearcher}
              setSelectedPerson={setSelectedPerson}
            />
          </div>
        </div>

        {peopleSearcher.length === 0 && (
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
      </main>
    </div>
  );
};
