import React, { useEffect, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropDown } from './DropDown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);
  const [error, setError] = useState(false);
  const [param, setParam] = useState('');
  const [contorovanyi, setContorovanyi] = useState('');

  const findPerson = React.useMemo(() => {
    const people = [...peopleFromServer];


    
    const find = people.filter(person => person.name.includes(param));

    return find;
  }, [param]);

  useEffect(() => {
    setError(findPerson.length === 0);
  }, [findPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        {selectedUser ? (
          <h1 className="title" data-cy="title">
            {`${selectedUser.name} (${selectedUser.born} - ${selectedUser.died})`}
          </h1>
        ) : (
          <h1 className="title" data-cy="title">
            No selected person
          </h1>
        )}

        <DropDown
          people={findPerson}
          setParam={setParam}
          setSelectedUser={setSelectedUser}
          setContorovanyi={setContorovanyi}
          contorovanyi={contorovanyi}

        />

        {error && (
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

/*

<div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Bernard Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Antone Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Petronella de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Hercke</p>
              </div>



              */
