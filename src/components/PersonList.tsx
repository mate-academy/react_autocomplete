import React from 'react';
import { Person } from '../types/Person';

type Props = {
  filteredPeople:Person[],
  setSelectedPerson:React.Dispatch<React.SetStateAction<undefined | Person>>,
  setIsVisibleList:React.Dispatch<React.SetStateAction<boolean>>,
  setInputValue:React.Dispatch<React.SetStateAction<string>>,
};

const PersonList: React.FC<Props> = ({
  filteredPeople,
  setSelectedPerson,
  setIsVisibleList,
  setInputValue,
}) => {
  // console.log('list')
  const selectPerson = (person:Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    setIsVisibleList(false);
  };

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {
          filteredPeople.length > 0 ? (
            filteredPeople.map(person => {
              return (
                <button
                  type="button"
                  className="dropdown-item"
                  key={person.slug}
                  onMouseDown={() => selectPerson(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </button>
              );
            }))
            : (
              <div className="dropdown-item">
                <p className="has-text-link">No matching suggestions</p>
              </div>
            )
        }
      </div>
    </div>
  );
};

export default PersonList;
