import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

interface Props {
  preparedPeopleList: Person[];
  handleSelectPerson: (person: Person) => void;
  // setAppliedQuery: () => void;
}

export const PersonList: React.FC<Props> = ({
  preparedPeopleList,
  handleSelectPerson,
  // setAppliedQuery,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      {preparedPeopleList.length ? (
        <div
          className="dropdown-content"
          style={{
            maxHeight: 400,
            overflowY: 'auto',
          }}
        >
          {preparedPeopleList.map(person => (
            <div
              className="dropdown-item"
              key={person.slug}
              onKeyDown={() => { }}
              role="button"
              tabIndex={0}
              onClick={() => handleSelectPerson(person)}
            >
              <p className={classNames({
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
              >
                {person.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div>No matching suggestions</div>
      )}
    </div>
  );
};
