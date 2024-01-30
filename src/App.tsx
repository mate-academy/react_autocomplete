import React, { useState } from 'react';
import 'bulma';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  return (
    <main className="section">
      {selectedPerson && (
        peopleFromServer.map((person) => {
          if (person.name === selectedPerson) {
            return (
              <h1 className="title" key={selectedPerson}>
                {`${person.name} (${person.born} - ${person.died})`}
              </h1>
            );
          }

          return null;
        })
      )}

      {!selectedPerson && (
        <h1 className="title">
          No selected person
        </h1>
      )}

      <Autocomplete onSelected={(person) => setSelectedPerson(person)} />
    </main>
  );
};

// import React, { useCallback, useMemo, useState } from 'react';
// import debounce from 'lodash.debounce';
// import 'bulma';
// import './App.scss';
// import { peopleFromServer } from './data/people';

// interface AppProps {
//   onSelected: (person: string) => void;
// }

// interface IHandleSuggestion {
//   (person: string): void;
// }

// export const App: React.FC<AppProps> = ({ onSelected }) => {
//   const [query, setQuery] = useState('');
//   const [appliedQuery, setAppliedQuery] = useState('');
//   const [showSuggestion, setShowSuggestion] = useState(false);
//   const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

//   const applyQuary = useCallback(
//     debounce(setAppliedQuery, 1000),
//     [],
//   );

//   const handleQuaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setQuery(event.target.value);
//     applyQuary(event.target.value);
//   };

//   const filterPerson = useMemo(() => {
//     return peopleFromServer.filter(user => (
//       user.name.toLowerCase().includes(appliedQuery.toLowerCase())
//     ));
//   }, [appliedQuery]);

//   const handleSuggestion: IHandleSuggestion = ((
//     person: string,
//   ) => {
//     setQuery(person);
//     setShowSuggestion(false);
//     setSelectedPerson(person);
//     onSelected(person);
//   });

//   return (
//     <main className="section">
//       <h1 className="title">
//         {selectedPerson && (
//           filterPerson.map((person) => {
//             if (person.name === selectedPerson) {
//               return (
//                 <h1 className="title" key={selectedPerson}>
//                   {`${person.name} (${person.born} - ${person.died})`}
//                 </h1>
//               );
//             }

//             return null;
//           })
//         )}

//         {!selectedPerson && (
//           <h1 className="title">
//             No selected person
//           </h1>
//         )}
//       </h1>

//       <div className="dropdown is-active">
//         <div className="dropdown-trigger">
//           <input
//             type="text"
//             placeholder="Enter a part of the name"
//             className="input"
//             value={query}
//             onChange={handleQuaryChange}
//             onFocus={() => setShowSuggestion(true)}
//           />
//         </div>

//         {showSuggestion && (
//           <div className="dropdown-menu" role="menu">
//             <div className="dropdown-content">
//               {filterPerson.length > 0 ? (
//                 filterPerson.map((person) => {
//                   return (
//                     <button
//                       className="dropdown-item"
//                       type="button"
//                       key={person.slug}
//                       onClick={() => handleSuggestion(person.name)}
//                     >
//                       <p
//                         className="has-text-link"
//                       >
//                         {person.name}
//                       </p>
//                     </button>
//                   );
//                 })
//               ) : (
//                 <div className="dropdown-item">
//                   No matching suggestions
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// };
