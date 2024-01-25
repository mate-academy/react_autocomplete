import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from './types/Person';
import { peopleFromServer as people } from './data/people';

type Props = {
  onSelect: React.Dispatch<React.SetStateAction<Person | null>>;
};

export const Dropdown: React.FC<Props> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsVisible(false);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSelect = (person: Person) => {
    setIsVisible(false);
    onSelect(person);
    setQuery(person.name);
  };

  const visiblePeople = useMemo(() => (
    people.filter(
      person => person.name
        .toLowerCase()
        .includes(appliedQuery.toLowerCase().trim()),
    )
  ), [people, appliedQuery]);

  useEffect(() => {
    setIsVisible(true);
  }, [appliedQuery]);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isVisible,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleInputChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {!visiblePeople.length
            ? 'No matching people'
            : (
              visiblePeople.map(person => (
                <div
                  role="button"
                  tabIndex={0}
                  className="dropdown-item"
                  onClick={() => handleSelect(person)}
                  onKeyDown={() => handleSelect(person)}
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
              )))}
        </div>
      </div>
    </div>
  );
};
