import React, { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
// import TextField from '@mui/material/TextField';
// eslint-disable-next-line max-len
// import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import 'bulma/css/bulma.css';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

function getPersonByName(name: string): Person[] {
  const lowerCaseName = name.toLowerCase();

  return peopleFromServer.filter(person => person.name
    .toLowerCase()
    .includes(lowerCaseName));
}

export const App: React.FC = () => {
  // eslint-disable-next-line max-len
  const [initialPeople, setInitialPeople] = useState<Person[]>(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [name, setName] = useState('');
  const [callDropdown, setCallDropdown] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filterPeople = useCallback(
    debounce(setInitialPeople, 1000),
    [],
  );

  const queryPerson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchName = event.target.value;

    setName(searchName);
    filterPeople(getPersonByName(searchName));
  };

  const handlePerson = (event: Person) => {
    setName(event.name);
    setSelectedPerson(event);
    setCallDropdown(false);
  };

  // const handleDropdown = () => {
  //   setCallDropdown(false);
  // };

  // const handleInputBlur = () => {
  //   debounce(handleDropdown, 100);
  // };

  // const handleInputBlur = () => {
  //   setTimeout(() => {
  //     setCallDropdown(false);
  //   }, 100);
  // };

  // const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Escape') {
  //     setCallDropdown(false);
  //   }
  // };

  const handleDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (!target.closest('.dropdown')) {
      setCallDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? (`${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`)
          : 'Nobody was selected'}
      </h1>
      {/* <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      /> */}
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={name}
            onKeyDown={() => { }}
            onChange={queryPerson}
            onMouseDown={() => setCallDropdown(true)}
            // onClick={() => setCallDropdown(true)}
          // onBlur={handleInputBlur}
          />
        </div>

        {callDropdown && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {initialPeople.map(person => {
                return (
                  <div
                    key={person.name}
                    className={
                      cn('dropdown-item', { 'is-danger': person.sex === 'f' })
                    }
                    onClick={() => handlePerson(person)}
                    onKeyDown={() => { }}
                    role="button"
                    tabIndex={0}
                  >
                    <p className={
                      cn('has-text-link', { 'is-danger': person.sex === 'f' })
                    }
                    >
                      {person.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
