import React, { useMemo, useRef, useState } from 'react';
import './App.scss';
import { DropDown } from './components/DropDown';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

/*eslint-disable*/

export const App: React.FC = () => {
  const [state, setState] = useState({
    isSelectedInput: false,
    isSelectedPerson: false,
    isSelectedPersonData: null as Person | null,
    query: '',
    appliedQuery: '',
  });

  const timeOut = useRef(0);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      query: event.target.value,
      isSelectedPerson: false,
    }));

    window.clearTimeout(timeOut.current);

    timeOut.current = window.setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        appliedQuery: event.target.value,
      }));
    }, 1000);
  };

  const normalizeQuery = state.appliedQuery.toLowerCase().trim();

  const filterByPerson = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(normalizeQuery),
    );
  }, [normalizeQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {state.isSelectedPersonData ? (
          `${state.isSelectedPersonData.name}
          (${state.isSelectedPersonData.born}
          = ${state.isSelectedPersonData.died})`
        ) : (
          'No selected person'
        )}

      </h1>

      <div className="dropdown is-active">
        <div
          className="dropdown-trigger"
          onClick={() => setState({
            ...state, isSelectedInput: true,
          })}
        >
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={state.isSelectedPerson ? (
              state.isSelectedPersonData?.name
            ) : (
              state.query
            )}
            onChange={handleQueryChange}
          />
        </div>

        {state.isSelectedInput && (
          <div className="dropdown-menu" role="menu">
            <DropDown
              setState={setState}
              filterByPerson={filterByPerson}
            />
          </div>
        )}
      </div>
    </main>
  );
};
