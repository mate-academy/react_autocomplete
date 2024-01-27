import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { Person } from '../../types/Person';

type Props = {
  setPerson: (value: Person | null) => void;
  setQuery: (value: string) => void;
  visiblPeople: Person[];
  applyQuery: (value: string) => void;
};

export const Dropdown: React.FC<Props> = ({
  setPerson,
  setQuery,
  visiblPeople,
  applyQuery,
}) => {
  const [value, setValue] = useState('');
  const [isActiv, setIsActiv] = useState(false);

  const hendleInputChang = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValue(e.target.value);
    applyQuery(e.target.value);
    setPerson(null);
  }, []);

  const selectPerson = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    human: Person,
  ) => {
    e.preventDefault();

    setQuery('');
    setValue(human.name);
    setPerson(human);

    setIsActiv(false);
  };

  return (
    <div className={classNames('dropdown', {
      'is-active': isActiv,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={value}
          onChange={hendleInputChang}
          onFocus={() => setIsActiv(true)}
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
      >
        <div className="dropdown-content">
          {visiblPeople.map(human => (
            <a
              href="#title"
              className="dropdown-item"
              data-cy="suggestion-item"
              key={human.name}
              onClick={e => selectPerson(e, human)}
            >
              {human.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
