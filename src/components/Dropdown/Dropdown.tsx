import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { Person } from '../../types/Person';
import { DropdownContent } from '../DropdownContent';

type Props = {
  setPerson: (value: Person | null) => void;
  setQuery: (value: string) => void;
  visiblePeople: Person[];
  applyQuery: (value: string) => void;
};

export const Dropdown: React.FC<Props> = ({
  setPerson,
  setQuery,
  visiblePeople,
  applyQuery,
}) => {
  const [value, setValue] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleInputChang = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValue(e.target.value);
    applyQuery(e.target.value);
    setPerson(null);
  }, [applyQuery, setPerson]);

  const selectPerson = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    human: Person,
  ) => {
    e.preventDefault();

    setQuery('');
    setValue(human.name);
    setPerson(human);

    setIsActive(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (e.relatedTarget) {
      return;
    }

    setIsActive(false);
  };

  return (
    <div className={classNames('dropdown', {
      'is-active': isActive,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={value}
          onChange={handleInputChang}
          onFocus={() => setIsActive(true)}
          onBlur={handleBlur}
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
      >
        {visiblePeople.length === 0
          || (
            <DropdownContent
              visiblPeople={visiblePeople}
              selectPerson={selectPerson}
            />
          )}
      </div>
    </div>
  );
};
