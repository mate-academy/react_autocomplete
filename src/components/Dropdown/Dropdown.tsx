import React, { memo } from 'react';
import classNames from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  filteredPersons: Person[],
  selectPerson: (chosenPerson: Person) => () => void
};

const Dropdown: React.FC<Props> = ({
  filteredPersons,
  selectPerson,
}) => {
  const noContentInfo = (
    <div className="dropdown-item">
      <p className="has-text-link">No matching suggestions</p>
    </div>
  );

  const list = (
    <>
      {filteredPersons.map(person => {
        return (
          <div
            key={person.slug}
            className="dropdown-item"
          >
            <button
              type="button"
              aria-haspopup="true"
              onClick={selectPerson(person)}
            >
              <span className={classNames({
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
              >
                {person.name}
              </span>
            </button>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {filteredPersons.length === 0 ? noContentInfo : list}
      </div>
    </div>
  );
};

const MemoizedDropdown = memo(Dropdown);

export { MemoizedDropdown };
