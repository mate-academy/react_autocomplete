import React from "react";
import { Person } from "../../../types/Person";


type Props = {
  persons: Person[],
  filterString: string,
  callback: (name: string) => void,
}

export const DropDownMenu: React.FC <Props>= ({persons, filterString, callback}) => {
  const filteredPeople = persons.filter(person => person.name.toLowerCase().includes(filterString.toLowerCase()));

  if (filteredPeople.length > 0) 
    {return (<div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map((person, index) => {
                return (<div className="dropdown-item" data-cy="suggestion-item" key = {index} >
                  <p 
                  style={{ cursor: "pointer" }} 
                  className="has-text-link" 
                  onMouseDown={() => {
                    callback(person.name);
                  }}
                  >
                    {person.name}
                  </p>
                </div>)
              })}
              

          </div>
      </div>)} 
       return (<div
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
        </div>)
      
            }