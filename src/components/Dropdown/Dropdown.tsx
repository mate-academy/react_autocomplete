import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';
import { Person } from '../../types/Person';
import { DropdownItem } from '../DropdownItem';

type Props = {
  people: Person[];
  query: string;
  setQuery: (value: string) => void;
  setAppliedQuery: (value: string) => void;
  setPerson: (value: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({
  people,
  query,
  setQuery,
  setPerson,
  setAppliedQuery,
  delay,
}) => {
  const [isDropdownShow, setIsDropdownShow] = useState(false);

  const applyQuery = useCallback(debounce((value: string) => {
    if (value) {
      setIsDropdownShow(true);
    }

    if (!value) {
      setIsDropdownShow(false);
    }

    setAppliedQuery(value);
  }, delay), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDropdownShow(false);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleButtonClick = () => {
    setQuery('');
    setPerson(null);
    setIsDropdownShow(false);
  };

  return (
    <div className={classNames('dropdown', {
      'is-active': isDropdownShow,
    })}
    >
      <div className="dropdown-trigger">
        <div className="field has-addons">
          <div className="control">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={query}
              onChange={handleInputChange}
            />
          </div>
          {query && (
            <div className="control">
              <button
                type="button"
                className="button is-info"
                onClick={handleButtonClick}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {people.length > 0 ? (
            people.map(person => (
              <DropdownItem
                key={person.slug}
                person={person}
                setPerson={setPerson}
                setQuery={setQuery}
                setIsDropdownShow={setIsDropdownShow}
              />
            ))
          ) : (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
