// import React, { useState } from 'react';
// import './App.scss';
// import { peopleFromServer } from './data/people';
// import { Message } from './components/Message';
// import { DropdownItem } from './components/DropdownItem';
// import { Title } from './components/Title';
// import { Person } from './types/Person';
// // import { Person } from './types/Person';

// export const App: React.FC = () => {
//   // const { name, born, died } = peopleFromServer[0];
//   const [people, setPeople] = useState<Person[]>(peopleFromServer);
//   const [filteredPersons, setFilteredPersons] = useState<Person[]>([]);
//   const [value, setValue] = useState<string>('');
//   const [person, setPerson] = useState<Person>();

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
//     setValue(event.target.value);

//     setFilteredPersons(
//       people.filter(person =>
//         person.name.toLowerCase().includes(event.target.value.toLowerCase()),
//       ),
//     );
//     // setPerson()
//   };

//   return (
//     <div className="container">
//       <main className="section is-flex is-flex-direction-column">
//         {person && <Title person={person} />}

//         <div className="dropdown is-active">
//           <div className="dropdown-trigger">
//             <input
//               type="text"
//               placeholder="Enter a part of the name"
//               className="input"
//               data-cy="search-input"
//               value={value}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
//             <div className="dropdown-content">
//               {filteredPersons.map(person => (
//                 <DropdownItem
//                   name={person.name}
//                   key={person.name + person.died}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         <Message />
//       </main>
//     </div>
//   );
// };
