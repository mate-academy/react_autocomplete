import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';
import cn from 'classnames';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const delay = 300;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce(e => {
      setAppliedQuery(e);
      setIsFocused(true);
    }, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedPerson(null);
    setIsFocused(false);
    applyQuery(event.target.value);
  };

  const filterPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name
        .toLowerCase()
        .trim()
        .includes(appliedQuery.trim().toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={cn('dropdown', { 'is-active': isFocused })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => setIsFocused(true)}
              onChange={handleQueryChange}
            />
          </div>

          {isFocused && filterPeople.length > 0 && (
            <Autocomplete
              setQuery={setQuery}
              setFocus={setIsFocused}
              onSelect={setSelectedPerson}
              people={filterPeople}
            />
          )}
        </div>

        {filterPeople.length === 0 && appliedQuery && (
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

// export const App: React.FC = () => {
//   const { name, born, died } = peopleFromServer[0];

//   return (
//     <div className="container">
//       <main className="section is-flex is-flex-direction-column">
//         <h1 className="title" data-cy="title">
//           {`${name} (${born} - ${died})`}
//         </h1>

//         <div className="dropdown is-active">
//           <div className="dropdown-trigger">
//             <input
//               type="text"
//               placeholder="Enter a part of the name"
//               className="input"
//               data-cy="search-input"
//             />
//           </div>

//           <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
//             <div className="dropdown-content">
//               <div className="dropdown-item" data-cy="suggestion-item">
//                 <p className="has-text-link">Pieter Haverbeke</p>
//               </div>

//               <div className="dropdown-item" data-cy="suggestion-item">
//                 <p className="has-text-link">Pieter Bernard Haverbeke</p>
//               </div>

//               <div className="dropdown-item" data-cy="suggestion-item">
//                 <p className="has-text-link">Pieter Antone Haverbeke</p>
//               </div>

//               <div className="dropdown-item" data-cy="suggestion-item">
//                 <p className="has-text-danger">Elisabeth Haverbeke</p>
//               </div>

//               <div className="dropdown-item" data-cy="suggestion-item">
//                 <p className="has-text-link">Pieter de Decker</p>
//               </div>

//               <div className="dropdown-item" data-cy="suggestion-item">
//                 <p className="has-text-danger">Petronella de Decker</p>
//               </div>

//               <div className="dropdown-item" data-cy="suggestion-item">
//                 <p className="has-text-danger">Elisabeth Hercke</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div
//           className="
//             notification
//             is-danger
//             is-light
//             mt-3
//             is-align-self-flex-start
//           "
//           role="alert"
//           data-cy="no-suggestions-message"
//         >
//           <p className="has-text-danger">No matching suggestions</p>
//         </div>
//       </main>
//     </div>
//   );
// };
