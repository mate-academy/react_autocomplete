// import React from 'react';
// import './App.scss';
// import { peopleFromServer } from './data/people';

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

// Updated App.tsx
import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Autocomplete';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonSelected = (person: Person | null) => {
    setSelectedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <Autocomplete
          people={peopleFromServer}
          onSelected={handlePersonSelected}
        />
      </main>
    </div>
  );
};
