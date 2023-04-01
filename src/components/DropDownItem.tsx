import React from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  person: Person,
  onSelect: (person: Person) => void,
  onQuery: () => void,
};

export const DropDownItem: React.FC<Props> = ({
  person,
  onSelect,
  onQuery,
}) => {
  const { name, sex } = person;
  const onClickItem = (
    e: { preventDefault: () => void; },
    currentPerson: Person,
  ) => {
    e.preventDefault();
    onSelect(currentPerson);
    onQuery();
  };

  return (
    <div className="dropdown-item">
      <p>
        <a
          href="#item"
          className={classNames({
            'has-text-link': sex === 'm',
            'has-text-danger': sex === 'f',
          })}
          onClick={(e) => onClickItem(e, person)}
        >
          {name}
        </a>
      </p>
    </div>
  );
};
