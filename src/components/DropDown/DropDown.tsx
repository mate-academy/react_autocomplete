import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';

import { Person } from '../../types/Person';
import { debounce } from '../../servises/debounce';
import { TIMER_DELAY } from '../../servises/constants';

type Props = {
  listOfPeople: Person[]
  onSelected: (person: Person) => void;
};

export const DropDown: React.FC<Props> = ({
  listOfPeople,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [applyQuery, setApplyQuery] = useState('');
  const [focusInput, setFocusInput] = useState(false);

  const filteredPeople = useMemo(() => {
    return listOfPeople.filter(
      person => person.name.toUpperCase().includes(applyQuery.toUpperCase()),
    );
  }, [applyQuery]);

  const applyedQuery = useCallback(debounce(setApplyQuery, TIMER_DELAY), []);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyedQuery(event.target.value);
  };

  const handleSelection = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
  };

  return (
    <div className={classNames('dropdown', {
      'is-active': focusInput,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onFocus={() => setFocusInput(true)}
          onBlur={() => setFocusInput(false)}
          onChange={handleChangeQuery}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length > 0
            ? (
              filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  role="button"
                  tabIndex={0}
                  onMouseDown={() => handleSelection(person)}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-dark">No matching suggestions</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
