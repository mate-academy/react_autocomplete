/* eslint-disable @typescript-eslint/indent */
// /* eslint-disable prettier/prettier */
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import './App.scss';
// import { peopleFromServer } from './data/people';

// export interface Person {
//   name: string;
//   sex: 'm' | 'f';
//   born: number;
//   died: number;
//   fatherName: string | null;
//   motherName: string | null;
//   slug: string;
// }

// interface AutocompleteProps {
//   people: Person[];
//   delay?: number;
//   onSelected: (person: Person) => void;
// }

// const Autocomplete: React.FC<AutocompleteProps> = ({
//   people,
//   delay = 300,
//   onSelected,
// }) => {
//   const [searchText, setSearchText] = useState('');
//   const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
//   const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const debounceTimeout = useRef<number | null>(null);
//   const prevSearchText = useRef<string>('');

//   const debounce = useCallback(
//     (func: () => void, wait: number) => {
//       if (debounceTimeout.current) {
//         clearTimeout(debounceTimeout.current);
//       }

//       debounceTimeout.current = window.setTimeout(func, wait);
//     },
//     [debounceTimeout],
//   );

//   useEffect(() => {
//     if (searchText === prevSearchText.current) {
//       return;
//     }

//     debounce(() => {
//       if (!searchText.trim()) {
//         setFilteredPeople(people);
//       } else {
//         const filtered = people.filter(person =>
//           person.name.toLowerCase().includes(searchText.toLowerCase()),
//         );

//         setFilteredPeople(filtered);
//       }

//       prevSearchText.current = searchText;
//     }, delay);
//   }, [searchText, people, delay, debounce]);

//   const handleInputChange: React.ChangeEventHandler<
//   HTMLInputElement
//   > = event => {
//     setSearchText(event.target.value);
//     if (selectedPerson) {
//       setSelectedPerson(null);
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       onSelected(null as any);
//     }

//     setShowSuggestions(true);
//   };

//   const handleFocus = () => {
//     if (!searchText.trim()) {
//       setFilteredPeople(people);
//     }

//     setShowSuggestions(true);
//   };

//   const handleSuggestionClick = (person: Person) => {
//     setSearchText(person.name);
//     setSelectedPerson(person);
//     setShowSuggestions(false);
//     onSelected(person);
//   };

//   return (
//     <div className="autocomplete">
//       <div className={`dropdown ${showSuggestions ? 'is-active' : ''}`}>
//         <div className="dropdown-trigger">
//           <input
//             type="text"
//             placeholder="Enter a part of the name"
//             className="input"
//             data-cy="search-input"
//             value={searchText}
//             onChange={handleInputChange}
//             onFocus={handleFocus}
//           />
//         </div>
//         {showSuggestions && (
//           <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
//             <div className="dropdown-content">
//               {filteredPeople.length > 0 ? (
//                 filteredPeople.map(person => (
//                   <div
//                     key={person.slug}
//                     className="dropdown-item"
//                     data-cy="suggestion-item"
//                     onClick={() => handleSuggestionClick(person)}
//                   >
//                     <p className="has-text-link">{person.name}</p>
//                   </div>
//                 ))
//               ) : (
//                 <div className="dropdown-item" data-cy="no-suggestions-message">
//                   <p className="has-text-danger">No matching suggestions</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export const App: React.FC = () => {
//   const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

//   const handleSelectedPerson = (person: Person) => {
//     setSelectedPerson(person);
//   };

//   return (
//     <div className="container">
//       <main className="section is-flex is-flex-direction-column">
//         <h1 className="title" data-cy="title">
//           {selectedPerson
//             ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
//             : 'No selected person'}
//         </h1>
//         <Autocomplete
//           people={peopleFromServer}
//           onSelected={handleSelectedPerson}
//         />
//       </main>
//     </div>
//   );
// };

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export interface Person {
  name: string;
  sex: 'm' | 'f';
  born: number;
  died: number;
  fatherName: string | null;
  motherName: string | null;
  slug: string;
}

interface AutocompleteProps {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeout = useRef<number | null>(null);
  const prevSearchText = useRef<string>('');

  const debounce = useCallback(
    (func: () => void, wait: number) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = window.setTimeout(func, wait);
    },
    [debounceTimeout],
  );

  useEffect(() => {
    if (searchText === prevSearchText.current) {
      return;
    }

    debounce(() => {
      if (!searchText.trim()) {
        setFilteredPeople(people);
      } else {
        const filtered = people.filter(person =>
          person.name.toLowerCase().includes(searchText.toLowerCase()),
        );

        setFilteredPeople(filtered);
      }

      prevSearchText.current = searchText;
    }, delay);
  }, [searchText, people, delay, debounce]);

  const handleInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = event => {
    setSearchText(event.target.value);
    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected(null); // Pass null to clear the selected person
    }

    setShowSuggestions(true);
  };

  const handleFocus = () => {
    if (!searchText.trim()) {
      setFilteredPeople(people);
    }

    setShowSuggestions(true);
  };

  const handleSuggestionClick = (person: Person) => {
    setSearchText(person.name);
    setSelectedPerson(person);
    setShowSuggestions(false);
    onSelected(person);
  };

  return (
    <div className="autocomplete">
      <div className={`dropdown ${showSuggestions ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={searchText}
            onChange={handleInputChange}
            onFocus={handleFocus}
          />
        </div>
        {showSuggestions && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length > 0 ? (
                filteredPeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSuggestionClick(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              ) : (
                <div className="dropdown-item" data-cy="no-suggestions-message">
                  <p className="has-text-danger">No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleSelectedPerson = (person: Person | null) => {
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
          onSelected={handleSelectedPerson}
        />
      </main>
    </div>
  );
};
