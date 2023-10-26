import React, { useMemo, useRef, useState } from 'react';

import './App.scss';

import { DropDown } from './components/DropDown';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [state, setState] = useState({
    isSelectedInput: false,
    isSelectedPerson: false,
    isSelectedPersonData: null as Person | null,
    query: '',
    appliedQuery: '',
  });

  // debounce

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

  //

  const normalizeQuery = state.appliedQuery.toLowerCase().trim();

  const filteredByPerson = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(normalizeQuery),
    );
  }, [normalizeQuery]);

  const {
    isSelectedPersonData,
    isSelectedInput,
    isSelectedPerson,
    query,
  } = state;

  return (
    <main className="section">
      <h1 className="title">
        {isSelectedPersonData ? (
          `${isSelectedPersonData.name}
          (${isSelectedPersonData.born}
          = ${isSelectedPersonData.died})`
        ) : (
          'No selected person'
        )}

      </h1>

      <div
        className="dropdown is-active"
      >
        <div
          className="dropdown-trigger"
        >
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={isSelectedPerson ? (
              isSelectedPersonData?.name
            ) : (
              query
            )}
            onChange={handleQueryChange}
            onFocus={() => setState({ ...state, isSelectedInput: true })}
            onBlur={() => setState({ ...state, isSelectedInput: false })}
          />
        </div>

        {isSelectedInput && (
          <div
            className="dropdown-menu"
            role="menu"
          >
            <DropDown
              setState={setState}
              filteredByPerson={filteredByPerson}
            />
          </div>
        )}
      </div>
    </main>
  );
};
