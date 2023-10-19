import cn from 'classnames';
import './Dropdown.scss';
import React, { useState, useMemo, useCallback } from 'react';
import { Person } from '../../types/Person';
import { debounce } from '../../services/debounce';

type Props = {
  peopleList: Person[];
  onSelected?: (person: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({
  peopleList,
  onSelected = () => { },
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return peopleList.filter(person => {
      const nameToLowerCase = person.name.toLowerCase();
      const quetyToLowerCase = appliedQuery.toLowerCase().trim();

      return nameToLowerCase.includes(quetyToLowerCase);
    });
  }, [peopleList, appliedQuery]);

  const handleSelect = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsVisible(false);
  };

  return (
    <div className={cn('dropdown', { 'is-active': isVisible })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsVisible(true)}
          onBlur={() => setIsVisible(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {
            filteredPeople.length
              ? (
                filteredPeople.map(person => {
                  const {
                    name,
                    slug,
                    sex,
                  } = person;

                  return (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div
                      className="dropdown-item dropdown-item--hover"
                      key={slug}
                      onMouseDown={() => handleSelect(person)}
                      onKeyDown={() => handleSelect(person)}
                    >
                      <p className={cn('has-text-link', {
                        'has-text-danger': sex === 'f',
                      })}
                      >
                        {name}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
};
