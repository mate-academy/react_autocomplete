import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  peoples: Person[];
  onSelect?: (person: Person) => void;
  setQuery?: (person: string) => void;
  handleBlur?: (person: boolean) => void;
};

const Dropdown: React.FC<Props> = React.memo(({
  peoples,
  onSelect = () => { },
  setQuery = () => { },
  handleBlur = () => { },
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current
      && !dropdownRef.current.contains(event.target as Node)) {
      handleBlur(true);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-menu" role="menu" ref={dropdownRef}>
      <div className="dropdown-content">
        {peoples.length === 0 ? (
          <div className="dropdown-item">
            <p>No matching suggestions</p>
          </div>
        ) : (
          peoples.map(person => (
            <button
              className="dropdown-item"
              type="button"
              key={person.name}
              onClick={() => {
                onSelect(person);
                setQuery(person.name);
                handleBlur(false);
              }}
            >
              <p
                className={classNames({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
});

export default Dropdown;
