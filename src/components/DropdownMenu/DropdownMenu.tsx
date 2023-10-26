import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  filterPerson: Person[];
  handlerOnMouseDown: (person: Person) => void;
  showPersonList: boolean;
};

const DropdownMenu: React.FC<Props> = React.memo(
  ({ filterPerson, handlerOnMouseDown, showPersonList }) => {
    return (
      <>
        {showPersonList && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filterPerson.length > 0 ? (
                  filterPerson.map((person: Person) => (
                    <div
                      key={person.slug}
                      role="button"
                      className="dropdown-item"
                      onMouseDown={() => {
                        handlerOnMouseDown(person);
                      }}
                      tabIndex={0}
                    >
                      <p
                        className={`person has-text-${
                          person.sex === 'm' ? 'link' : 'danger'
                        }`}
                      >
                        {person.name}
                      </p>
                    </div>
                  ))
              ) : (
                <span>No matching suggestions</span>
              )}
            </div>
          </div>
        )}
      </>
    );
  },
);

export default DropdownMenu;
